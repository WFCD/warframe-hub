'use client';

import type { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';

type ContentSearchToolbarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  compact?: boolean;
};

const ContentSearchToolbar: FC<ContentSearchToolbarProps> = ({
  value,
  onChange,
  placeholder,
  id = 'filterInput',
  compact = false,
}: ContentSearchToolbarProps) => {
  const { t } = useTranslation();
  const searchPlaceholder = placeholder ?? t('ui.search.contentPlaceholder');

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const dirty = value.length > 0;

  return (
    <div className={['hub-content-search', compact ? 'hub-content-search--compact' : ''].filter(Boolean).join(' ')}>
      <div
        className={[
          'hub-content-search__input',
          'hub-content-search-native',
          dirty ? 'hub-content-search-native--dirty' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <label htmlFor={id} className='sr-only'>
          {searchPlaceholder}
        </label>
        <span className='hub-content-search-native__icon' aria-hidden>
          <i className='fas fa-search' />
        </span>
        <input
          id={id}
          type='search'
          className='hub-content-search-native__field'
          value={value}
          onChange={onInputChange}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
        {dirty ? (
          <button
            type='button'
            className='hub-content-search-native__clear-inline'
            aria-label={t('ui.search.clear')}
            onClick={() => onChange('')}
          >
            <i className='fas fa-times' aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ContentSearchToolbar;
