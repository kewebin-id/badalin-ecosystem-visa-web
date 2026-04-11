import { ColumnDef, Table } from '@tanstack/react-table';
import { ReactNode } from 'react';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value?: string) => void;
  delayDebounce?: number;
  loading?: boolean;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}
