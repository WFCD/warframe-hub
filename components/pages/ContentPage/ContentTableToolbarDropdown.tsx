'use client';

import { useState, type FC, type ReactNode } from 'react';
import { Dropdown } from '@heroui/react';
import { hubTestOpenHandler } from '@/lib/test/hubTestInterop';

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
}: ContentTableToolbarDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <Dropdown.Trigger>
        <button
          type="button"
          className={['hub-content-table-toolbar-dropdown', active ? 'is-active' : ''].filter(Boolean).join(' ')}
          aria-label={ariaLabel}
          {...hubTestOpenHandler(() => setIsOpen(true))}
        >
          <span className="hub-content-table-toolbar-dropdown__label">{label}</span>
          <i className="fas fa-chevron-down hub-content-table-toolbar-dropdown__icon" aria-hidden />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Popover className="hub-content-table-toolbar-dropdown-popover">{children}</Dropdown.Popover>
    </Dropdown>
  );
};

export default ContentTableToolbarDropdown;
