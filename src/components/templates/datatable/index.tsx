'use client';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms';
import { InputTextSearch } from '@/components/molecules/input/search';
import { InputSelect } from '@/components/molecules/input/select';
import styles from '@/shared/styles/components/datatable.module.css';
import { cn } from '@/shared/utils';
import { flexRender } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { EmptyState } from '../empty-state';
import { LoadingState } from '../loading-state';
import { DataTableProps } from './datatable';

import { useTranslations } from 'next-intl';

export const DataTable = <TData, TValue>({
  columns,
  table,
  searchKey,
  searchPlaceholder,
  onSearchChange,
  delayDebounce = 1000,
  loading = false,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  onRowClick,
}: DataTableProps<TData, TValue>) => {
  const t = useTranslations('Common');

  const searchPlaceholderLabel = searchPlaceholder || t('search');
  const emptyTitleLabel = emptyTitle || t('noData');

  const initialSearchValue = useMemo(() => {
    if (searchKey) {
      const filterValue = table.getColumn(searchKey)?.getFilterValue() as string;
      return filterValue ?? '';
    }
    return '';
  }, [searchKey, table]);

  const paginationOptions = useMemo(
    () =>
      [10, 20, 30, 40, 50].map((e) => ({
        label: e.toString(),
        value: e.toString(),
      })),
    [],
  );

  const [searchValue, setSearchValue] = useState<string>(initialSearchValue);

  const handleSetSearch = useCallback(
    (value?: string) => {
      const stringValue = value || '';
      setSearchValue((prev) => {
        if (prev === stringValue) return prev;
        return stringValue;
      });

      if (searchKey) {
        const column = table.getColumn(searchKey);
        if (column && column.getFilterValue() !== (stringValue || undefined)) {
          column.setFilterValue(stringValue || undefined);
        }
      }

      if (onSearchChange) {
        onSearchChange(stringValue);
      }
    },
    [searchKey, table, onSearchChange],
  );

  return (
    <div className={styles.container}>
      {/* Search */}
      {searchKey && (
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <InputTextSearch
            placeholder={searchPlaceholderLabel}
            search={searchValue}
            setSearch={handleSetSearch}
            delayDebounce={delayDebounce}
            size="sm"
          />
        </div>
      )}

      {/* Table */}
      <div className={styles.tableWrapper}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className={styles.headerRow}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={styles.tableHead}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns?.length} className={styles.emptyCell}>
                  <LoadingState message={t('loading')} />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    styles.tableRow,
                    onRowClick && 'cursor-pointer hover:bg-gray-50/50 transition-colors',
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns?.length} className={styles.emptyCell}>
                  <EmptyState
                    icon={emptyIcon || undefined}
                    title={emptyTitleLabel}
                    description={emptyDescription}
                    action={emptyAction}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <div className={styles.paginationLeft}>
          <span className={styles.paginationLabel}>{t('rowsPerPage') || 'Rows per page'}</span>
          <div className="w-20">
            <InputSelect
              options={paginationOptions}
              value={table?.getState()?.pagination.pageSize?.toString() ?? '10'}
              setValue={(value) => {
                table.setPageSize(Number(value));
              }}
              size="sm"
              className="w-full"
            />
          </div>
        </div>
        <div className={styles.paginationRight}>
          <span className={styles.paginationPageInfo}>
            {t('page', {
              current: table.getState().pagination.pageIndex + 1,
              total: table.getPageCount(),
            }) || `Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`}
          </span>
          <div className={styles.paginationButtons}>
            <Button
              variant="primaryOutline"
              className="bg-white!"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="primaryOutline"
              className="bg-white!"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="primaryOutline"
              className="bg-white!"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="primaryOutline"
              className="bg-white!"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
