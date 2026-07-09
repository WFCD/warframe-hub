'use client';

import type { FC, ReactNode } from 'react';
import ContentPagination from './ContentPagination';
import ContentSearchToolbar from './ContentSearchToolbar';
import ContentTableToolbar from './ContentTableToolbar';

export type ContentDataTableSearchProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export type ContentDataTablePaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export type ContentDataTableProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  pagination?: ContentDataTablePaginationProps;
  search?: ContentDataTableSearchProps;
  filters?: ReactNode;
  actions?: ReactNode;
};

const ContentDataTable: FC<ContentDataTableProps> = ({
  ariaLabel,
  children,
  className,
  pagination,
  search,
  filters,
  actions,
}: ContentDataTableProps) => {
  const tableClass = ['hub-content-table', 'hub-native-table', className].filter(Boolean).join(' ');

  return (
    <>
      {pagination ? (
        <ContentPagination
          page={pagination.page}
          pageCount={pagination.pageCount}
          onPageChange={pagination.onPageChange}
        />
      ) : null}
      <div className="hub-content-panel hub-content-panel--flush">
        <ContentTableToolbar
          filters={filters}
          actions={actions}
          search={
            search ? (
              <ContentSearchToolbar
                id={search.id}
                value={search.value}
                onChange={search.onChange}
                placeholder={search.placeholder}
                compact
              />
            ) : undefined
          }
        />
        <div className="hub-content-table-wrap">
          <table className={tableClass} aria-label={ariaLabel}>
            {children}
          </table>
        </div>
      </div>
    </>
  );
};

export default ContentDataTable;
