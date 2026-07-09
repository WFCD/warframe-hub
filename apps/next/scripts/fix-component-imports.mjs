#!/usr/bin/env node
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = join(fileURLToPath(new URL('..', import.meta.url)));

const importMap = [
  ['@/components/ClientShell', '@/components/chrome/ClientShell'],
  ['@/components/Navbar', '@/components/chrome/Navbar'],
  ['@/components/OfflineBanner', '@/components/chrome/OfflineBanner'],
  ['@/components/PwaUpdatePrompt', '@/components/chrome/PwaUpdatePrompt'],
  ['@/components/CycleTimers', '@/components/cycles/CycleTimers'],
  ['@/components/CycleTimerDock', '@/components/cycles/CycleTimerDock'],
  ['@/components/TimersPage', '@/components/pages/TimersPage'],
  ['@/components/TimeBadge', '@/components/ui/TimeBadge'],
  ['@/components/NoDataItem', '@/components/ui/NoDataItem'],
  ['@/components/HubSwitch', '@/components/ui/HubSwitch'],
  ['@/components/HubRadioGroup', '@/components/ui/HubRadioGroup'],
  ['@/components/HubTrackableMultiSelect', '@/components/ui/HubTrackableMultiSelect'],
  ['@/components/CodexCard', '@/components/ui/CodexCard'],
  ['@/components/HubImg', '@/components/media/HubImg'],
  ['@/components/FishImg', '@/components/media/FishImg'],
  ['@/components/SynthesisImg', '@/components/media/SynthesisImg'],
  ['@/components/AsyncItemThumb', '@/components/media/AsyncItemThumb'],
  ['@/components/BaseMap', '@/components/maps/BaseMap'],
  ['@/components/MapLayers', '@/components/maps/MapLayers'],
  ['@/components/HubPanelWrap', '@/components/panels/shared/HubPanelWrap'],
  ['@/components/BountyJobsTable', '@/components/panels/shared/BountyJobsTable'],
  ['@/components/InvasionItem/InvasionItem', '@/components/panels/shared/InvasionItem'],
  ['@/components/modals/SettingsModal', '@/components/modals/SettingsModal'],
  ['@/components/modals/AboutModal', '@/components/modals/AboutModal'],
  ["from '../TimeBadge'", "from '@/components/ui/TimeBadge'"],
  ["from '../NoDataItem'", "from '@/components/ui/NoDataItem'"],
  ["from '../HubSwitch'", "from '@/components/ui/HubSwitch'"],
  ["from '../HubRadioGroup'", "from '@/components/ui/HubRadioGroup'"],
  ["from '../HubPanelWrap'", "from '@/components/panels/shared/HubPanelWrap'"],
  ["from '../HubImg'", "from '@/components/media/HubImg'"],
  ["from '../BountyJobsTable'", "from '@/components/panels/shared/BountyJobsTable'"],
  ["from '../InvasionItem/InvasionItem'", "from '@/components/panels/shared/InvasionItem'"],
  ["from './HubImg'", "from '@/components/media/HubImg'"],
  ["from './filters/GeneralFilter'", "from '@/components/modals/filters/GeneralFilter'"],
  ["from './filters/ComponentsFilter'", "from '@/components/modals/filters/ComponentsFilter'"],
  ["from './filters/NotificationFilters'", "from '@/components/modals/filters/NotificationFilters'"],
  ["from './filters/FissureFilters'", "from '@/components/modals/filters/FissureFilters'"],
  ["from './filters/SoundFilters'", "from '@/components/modals/filters/SoundFilters'"],
  ["from './AlertPanel'", "from './AlertPanel.component'"],
  ["from './NightwavePanel'", "from './NightwavePanel.component'"],
  ["from './ConclavePanel'", "from './ConclavePanel.component'"],
  ["from './FissuresPanel'", "from './FissuresPanel.component'"],
  ["from '../CycleTimers'", "from '@/components/cycles/CycleTimers'"],
  ["from '../../lib/providers/PrefsProvider'", "from '@/lib/providers/PrefsProvider'"],
  ["from '../../lib/providers/MapsProvider'", "from '@/lib/providers/MapsProvider'"],
  ["import './news.less'", "import './NewsPanel.component.less'"],
];

async function walk(dir, files = []) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) {
      if (name === 'node_modules' || name === '.next') continue;
      await walk(p, files);
    } else if (['.ts', '.tsx', '.js', '.jsx', '.cy.tsx'].includes(extname(name))) {
      files.push(p);
    }
  }
  return files;
}

async function main() {
  const files = await walk(appRoot);
  for (const file of files) {
    let content = await readFile(file, 'utf8');
    let changed = false;
    for (const [from, to] of importMap) {
      if (content.includes(from)) {
        content = content.split(from).join(to);
        changed = true;
      }
    }
    if (changed) {
      await writeFile(file, content);
      console.log('updated', file.replace(appRoot + '/', ''));
    }
  }
}

main();
