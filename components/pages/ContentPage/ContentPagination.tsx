'use client';

import { useMemo, type FC } from 'react';

type ContentPaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

const WINDOW = 5;

const visiblePages = (page: number, pageCount: number): number[] => {
  if (pageCount <= WINDOW) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const half = Math.floor(WINDOW / 2);
  let start = page - half;
  let end = page + half;

  if (start < 1) {
    start = 1;
    end = WINDOW;
  } else if (end > pageCount) {
    end = pageCount;
    start = pageCount - WINDOW + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

const ContentPagination: FC<ContentPaginationProps> = ({
  page,
  pageCount,
  onPageChange,
}: ContentPaginationProps) => {
  const pages = useMemo(() => visiblePages(page, pageCount), [page, pageCount]);

  if (pageCount <= 1) return null;

  const atStart = page <= 1;
  const atEnd = page >= pageCount;

  return (
    <nav className="hub-content-pagination" aria-label="Pagination">
      <button
        type="button"
        className="hub-content-pagination-btn"
        disabled={atStart}
        aria-label="First page"
        onClick={() => onPageChange(1)}
      >
        <i className="fas fa-angle-double-left" aria-hidden />
      </button>
      <button
        type="button"
        className="hub-content-pagination-btn"
        disabled={atStart}
        aria-label="Previous page"
        onClick={() => onPageChange(page - 1)}
      >
        <i className="fas fa-chevron-left" aria-hidden />
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          className={['hub-content-pagination-btn', pageNumber === page ? 'is-active' : '']
            .filter(Boolean)
            .join(' ')}
          aria-label={`Page ${pageNumber}`}
          aria-current={pageNumber === page ? 'page' : undefined}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        className="hub-content-pagination-btn"
        disabled={atEnd}
        aria-label="Next page"
        onClick={() => onPageChange(page + 1)}
      >
        <i className="fas fa-chevron-right" aria-hidden />
      </button>
      <button
        type="button"
        className="hub-content-pagination-btn"
        disabled={atEnd}
        aria-label="Last page"
        onClick={() => onPageChange(pageCount)}
      >
        <i className="fas fa-angle-double-right" aria-hidden />
      </button>
    </nav>
  );
};

export default ContentPagination;
