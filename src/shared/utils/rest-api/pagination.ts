interface PaginationInterface<T> {
  count: number;
  rows: T[];
}

export interface PaginatedResult<T> {
  totalItems: number;
  items: T[];
  totalPages: number;
  currentPage: number;
  links: {
    prev: string | null;
    next: string | null;
  };
}

export class Pagination {
  page: number;
  limit: number;
  offset: number;

  constructor(page: number | string, size: number | string) {
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    const sizeNum = typeof size === 'string' ? parseInt(size, 10) : size;
    this.page = !isNaN(pageNum) ? pageNum : 1;
    this.limit = !isNaN(sizeNum) ? sizeNum : 10;
    this.offset = (this.page - 1) * this.limit;
  }

  paginate<T>(data: PaginationInterface<T>): PaginatedResult<T> {
    const totalPages = Math.ceil(data.count / this.limit);
    return {
      totalItems: data.count,
      items: data.rows,
      totalPages: totalPages,
      currentPage: this.page,
      links: {
        prev: this.page > 1 ? `?page=${this.page - 1}&limit=${this.limit}` : null,
        next: this.page < totalPages ? `?page=${this.page + 1}&limit=${this.limit}` : null,
      },
    };
  }
}
