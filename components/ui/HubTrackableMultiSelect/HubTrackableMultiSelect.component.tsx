'use client';
import './HubTrackableMultiSelect.component.scss';

import type { FC } from 'react';
import type { Key } from '@heroui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Autocomplete,
  Button,
  EmptyState,
  Label,
  ListBox,
  SearchField,
  Tag,
  TagGroup,
  useFilter,
} from '@heroui/react';

export type TrackableSelectOption = {
  key: string;
  text: string;
};

type Props = {
  label: string;
  placeholder: string;
  options: TrackableSelectOption[];
  selectedKeys: string[];
  onSelectionChange: (keys: Key[]) => void;
  showSelectAll?: boolean;
};

const normalizeKeys = (keys: Key | Key[] | null): Key[] => {
  if (keys == null) return [];
  return Array.isArray(keys) ? keys : [keys];
};

const HubTrackableMultiSelect: FC<Props> = ({
  label,
  placeholder,
  options,
  selectedKeys,
  onSelectionChange,
  showSelectAll = false,
}: Props) => {
  const { t } = useTranslation();
  const { contains } = useFilter({ sensitivity: 'base' });
  const optionByKey = useMemo(() => new Map(options.map((option) => [option.key, option])), [options]);
  const allOptionKeys = useMemo(() => options.map((option) => option.key), [options]);

  const onRemoveTags = (keys: Set<Key>) => {
    onSelectionChange(selectedKeys.filter((key) => !keys.has(key)));
  };

  return (
    <div className="hub-settings-field">
      <Autocomplete
        fullWidth
        className="hub-settings-select hub-settings-multiselect"
        placeholder={placeholder}
        selectionMode="multiple"
        value={selectedKeys}
        onChange={(keys) => onSelectionChange(normalizeKeys(keys))}
      >
        <Label className="hub-settings-section-label">{label}</Label>
        <Autocomplete.Trigger>
          <Autocomplete.Value>
            {({ defaultChildren, isPlaceholder, state }) => {
              if (isPlaceholder || state.selectedItems.length === 0) {
                return defaultChildren;
              }

              return (
                <TagGroup size="sm" onRemove={onRemoveTags}>
                  <TagGroup.List>
                    {state.selectedItems.map((item) => {
                      const option = optionByKey.get(String(item.key));
                      if (!option) return null;

                      return (
                        <Tag key={option.key} id={option.key}>
                          {option.text}
                        </Tag>
                      );
                    })}
                  </TagGroup.List>
                </TagGroup>
              );
            }}
          </Autocomplete.Value>
          <Autocomplete.ClearButton />
          <Autocomplete.Indicator />
        </Autocomplete.Trigger>
        <Autocomplete.Popover className="hub-settings-multiselect-popover">
          <Autocomplete.Filter filter={contains}>
            {showSelectAll ? (
              <div className="hub-settings-multiselect-actions">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onPress={() => onSelectionChange(allOptionKeys)}
                >
                  {t('ui.selectAll')}
                </Button>
                <Button type="button" size="sm" variant="ghost" onPress={() => onSelectionChange([])}>
                  {t('ui.clearAll')}
                </Button>
              </div>
            ) : null}
            {/* Focus filter input when the popover opens for keyboard users. */}
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <SearchField autoFocus name="search" variant="secondary">
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder={t('ui.search')} />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
            <ListBox renderEmptyState={() => <EmptyState>{t('ui.noMatches')}</EmptyState>}>
              {options.map((option) => (
                <ListBox.Item key={option.key} id={option.key} textValue={option.text}>
                  {option.text}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Autocomplete.Filter>
        </Autocomplete.Popover>
      </Autocomplete>
    </div>
  );
};

export default HubTrackableMultiSelect;
