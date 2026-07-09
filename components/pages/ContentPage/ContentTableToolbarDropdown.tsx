'use client';

import type { FC, ReactNode } from 'react';
import { Dropdown } from '@heroui/react';

type ContentTableToolbarDropdownProps = {
  label: ReactNode;
  active?: boolean;
  ariaLabel?: string;
  children: ReactNode;
};

const ContentTableToolbarDropdown: FC<ContentTableToolbarDropdownProps> = ({
  label,
  active = false,
  ariaLabel,
  children,
}: ContentTableToolbarDropdownProps) => (
  <Dropdown>
    <Dropdown.Trigger>
      <button
        type="button"
        className={['hub-content-table-toolbar-dropdown', active ? 'is-active' : ''].filter(Boolean).join(' ')}
        aria-label={ariaLabel}
      >
        <span className="hub-content-table-toolbar-dropdown__label">{label}</span>
        <i className="fas fa-chevron-down hub-content-table-toolbar-dropdown__icon" aria-hidden />
      </button>
    </Dropdown.Trigger>
    <Dropdown.Popover className="hub-content-table-toolbar-dropdown-popover">{children}</Dropdown.Popover>
  </Dropdown>
);

export default ContentTableToolbarDropdown;
