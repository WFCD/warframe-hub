'use client';

import { useEffect, type FC } from 'react';
import { useCache } from '@/lib/providers/CacheProvider';
const CodexView: FC = () => {
  const { state, updateWarframes, updateWeapons, updateMods } = useCache();

  useEffect(() => {
    if (!state.mods.length) void updateMods();
    if (!state.warframes.length) void updateWarframes();
    if (!state.weapons.length) void updateWeapons();
  }, [state.mods.length, state.warframes.length, state.weapons.length, updateMods, updateWarframes, updateWeapons]);

  return null;
};
export default CodexView;
