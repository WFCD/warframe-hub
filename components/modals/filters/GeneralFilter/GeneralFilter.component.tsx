'use client';
import type { FC } from 'react';
import { useState } from 'react';

import { Label, ListBox, Select } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { usePrefs } from '@/lib/providers/PrefsProvider';
import { hubTestClickHandler, hubTestOpenHandler } from '@/lib/test/hubTestInterop';
import type { Platform } from '@/lib/shared';
import platforms from '@/data/json/platforms.json';
import locales from '@/data/json/locales.json';
import themes from '@/data/json/themes.json';

type PlatformEntry = {
  display: string;
  key: string;
  icon: string;
};

type LocaleEntry = {
  display: string;
  key: string;
};

type ThemeEntry = {
  key: string;
  display: string;
  faclass: string;
};

const platformEntries = Object.values(platforms as Record<string, PlatformEntry>);
const localeEntries = Object.values(locales as Record<string, LocaleEntry>);
const themeEntries = themes as ThemeEntry[];

const jsonKeyToPlatform = (key: string): Platform => (key === 'swi' ? 'switch' : (key as Platform));

const platformToJsonKey = (platform: Platform): string => (platform === 'switch' ? 'swi' : platform);

const GeneralFilter: FC = () => {
  const { t } = useTranslation();
  const { state, setPlatform, setLocale, setTheme } = usePrefs();
  const [platformOpen, setPlatformOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <div className='hub-settings-general'>
      <div className='hub-settings-field'>
        <Select
          fullWidth
          className='hub-settings-select'
          value={platformToJsonKey(state.platform)}
          isOpen={platformOpen}
          onOpenChange={setPlatformOpen}
          onChange={(key) => {
            if (key) setPlatform(jsonKeyToPlatform(String(key)));
          }}
        >
          <Label className='hub-settings-section-label'>{t('settings.platform')}</Label>
          <Select.Trigger {...hubTestOpenHandler(() => setPlatformOpen(true))}>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {platformEntries.map((platform) => (
                <ListBox.Item
                  key={platform.key}
                  id={platform.key}
                  textValue={platform.display}
                  {...hubTestClickHandler(() => {
                    setPlatform(jsonKeyToPlatform(platform.key));
                    setPlatformOpen(false);
                  })}
                >
                  <span className='hub-settings-select-option'>
                    <i className={`${platform.icon} fa-lg`} aria-hidden />
                    {platform.display}
                  </span>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className='hub-settings-field'>
        <Select
          fullWidth
          className='hub-settings-select'
          value={state.locale}
          isOpen={localeOpen}
          onOpenChange={setLocaleOpen}
          onChange={(key) => {
            if (key) setLocale(String(key));
          }}
        >
          <Label className='hub-settings-section-label'>{t('settings.language')}</Label>
          <Select.Trigger {...hubTestOpenHandler(() => setLocaleOpen(true))}>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {localeEntries.map((locale) => (
                <ListBox.Item key={locale.key} id={locale.key} textValue={locale.display}>
                  {locale.display}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className='hub-settings-field'>
        <Select
          fullWidth
          className='hub-settings-select'
          value={state.theme}
          isOpen={themeOpen}
          onOpenChange={setThemeOpen}
          onChange={(key) => {
            if (key) setTheme(String(key));
          }}
        >
          <Label className='hub-settings-section-label'>{t('settings.theme')}</Label>
          <Select.Trigger {...hubTestOpenHandler(() => setThemeOpen(true))}>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {themeEntries.map((theme) => (
                <ListBox.Item key={theme.key} id={theme.key} textValue={theme.display}>
                  <span className='hub-settings-select-option'>
                    <i className={`${theme.faclass} me-2`} aria-hidden />
                    {theme.display}
                  </span>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>
    </div>
  );
};

export default GeneralFilter;
