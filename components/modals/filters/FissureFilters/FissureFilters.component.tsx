'use client';
import type { FC } from 'react';
import type { Key } from '@heroui/react';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import HubTrackableMultiSelect from '@/components/ui/HubTrackableMultiSelect';
import { getFissurePlanetOptions, getHiddenFissurePlanetKeys } from '@/lib/fissurePlanets';
import { usePrefs } from '@/lib/providers/PrefsProvider';

const FissureFilters: FC = () => {
  const { t } = useTranslation();
  const { state, dispatch } = usePrefs();

  const planetOptions = useMemo(
    () => getFissurePlanetOptions(state.fissurePlanets, t),
    [state.fissurePlanets, t],
  );
  const hiddenPlanetKeys = useMemo(() => getHiddenFissurePlanetKeys(state.fissurePlanets), [state.fissurePlanets]);

  const applyHiddenPlanets = (keys: Key[]) => {
    const hidden = new Set(keys.map(String));
    Object.keys(state.fissurePlanets).forEach((key) => {
      dispatch({ type: 'SET_FISSURE_PLANET', payload: [key, hidden.has(key)] });
    });
  };

  return (
    <div className='hub-settings-fissures'>
      <p className='hub-settings-notifications-help'>{t('settings.fissuresHelp')}</p>
      <HubTrackableMultiSelect
        label={t('settings.fissuresHiddenPlanets')}
        placeholder={t('settings.fissuresHiddenPlaceholder')}
        options={planetOptions}
        selectedKeys={hiddenPlanetKeys}
        onSelectionChange={applyHiddenPlanets}
      />
    </div>
  );
};
export default FissureFilters;
