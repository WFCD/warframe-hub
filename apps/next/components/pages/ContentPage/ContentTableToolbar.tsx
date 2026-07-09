'use client';

import type { FC, ReactNode } from 'react';

export type ContentTableToolbarProps = {
  search?: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
};

const ContentTableToolbar: FC<ContentTableToolbarProps> = ({
  search,
  filters,
  actions,
}: ContentTableToolbarProps) => {
  if (!search && !filters && !actions) return null;

  return (
    <div className="hub-content-table-toolbar">
      {filters ? <div className="hub-content-table-toolbar__filters">{filters}</div> : null}
      {search ? <div className="hub-content-table-toolbar__search">{search}</div> : null}
      {actions ? <div className="hub-content-table-toolbar__actions">{actions}</div> : null}
    </div>
  );
};

export default ContentTableToolbar;
