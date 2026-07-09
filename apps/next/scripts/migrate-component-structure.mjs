#!/usr/bin/env node
/**
 * One-shot: move components into grouped folders with *.component.tsx naming.
 */
import { mkdir, readFile, rename, writeFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)), 'components');

const moves = [
  ['ClientShell.tsx', 'chrome/ClientShell/ClientShell.component.tsx'],
  ['Navbar.tsx', 'chrome/Navbar/Navbar.component.tsx'],
  ['OfflineBanner.tsx', 'chrome/OfflineBanner/OfflineBanner.component.tsx'],
  ['PwaUpdatePrompt.tsx', 'chrome/PwaUpdatePrompt/PwaUpdatePrompt.component.tsx'],
  ['CycleTimers.tsx', 'cycles/CycleTimers/CycleTimers.component.tsx'],
  ['CycleTimers.cy.tsx', 'cycles/CycleTimers/CycleTimers.cy.tsx'],
  ['CycleTimerDock.tsx', 'cycles/CycleTimerDock/CycleTimerDock.component.tsx'],
  ['TimersPage.tsx', 'pages/TimersPage/TimersPage.component.tsx'],
  ['TimeBadge.tsx', 'ui/TimeBadge/TimeBadge.component.tsx'],
  ['NoDataItem.tsx', 'ui/NoDataItem/NoDataItem.component.tsx'],
  ['HubSwitch.tsx', 'ui/HubSwitch/HubSwitch.component.tsx'],
  ['HubRadioGroup.tsx', 'ui/HubRadioGroup/HubRadioGroup.component.tsx'],
  ['HubTrackableMultiSelect.tsx', 'ui/HubTrackableMultiSelect/HubTrackableMultiSelect.component.tsx'],
  ['CodexCard.tsx', 'ui/CodexCard/CodexCard.component.tsx'],
  ['HubImg.tsx', 'media/HubImg/HubImg.component.tsx'],
  ['FishImg.tsx', 'media/FishImg/FishImg.component.tsx'],
  ['SynthesisImg.tsx', 'media/SynthesisImg/SynthesisImg.component.tsx'],
  ['AsyncItemThumb.tsx', 'media/AsyncItemThumb/AsyncItemThumb.component.tsx'],
  ['BaseMap.tsx', 'maps/BaseMap/BaseMap.component.tsx'],
  ['MapLayers.tsx', 'maps/MapLayers/MapLayers.component.tsx'],
  ['HubPanelWrap.tsx', 'panels/shared/HubPanelWrap/HubPanelWrap.component.tsx'],
  ['BountyJobsTable.tsx', 'panels/shared/BountyJobsTable/BountyJobsTable.component.tsx'],
  ['InvasionItem/InvasionItem.tsx', 'panels/shared/InvasionItem/InvasionItem.component.tsx'],
  ['modals/AboutModal.tsx', 'modals/AboutModal/AboutModal.component.tsx'],
  ['modals/SettingsModal.tsx', 'modals/SettingsModal/SettingsModal.component.tsx'],
  ['modals/filters/ComponentsFilter.tsx', 'modals/filters/ComponentsFilter/ComponentsFilter.component.tsx'],
  ['modals/filters/FissureFilters.tsx', 'modals/filters/FissureFilters/FissureFilters.component.tsx'],
  ['modals/filters/GeneralFilter.tsx', 'modals/filters/GeneralFilter/GeneralFilter.component.tsx'],
  ['modals/filters/NotificationFilters.tsx', 'modals/filters/NotificationFilters/NotificationFilters.component.tsx'],
  ['modals/filters/SoundFilters.tsx', 'modals/filters/SoundFilters/SoundFilters.component.tsx'],
  ['panels/news.less', 'panels/worldstate/NewsPanel/NewsPanel.component.less'],
];

const panelFiles = [
  'AcolytesPanel',
  'AlertPanel',
  'ArbitrationPanel',
  'BountyPanel',
  'ConclavePanel',
  'ConstructionPanel',
  'DarvoDealsPanel',
  'EventsPanel',
  'FissuresPanel',
  'InvasionsPanel',
  'KuvaPanel',
  'NewsPanel',
  'NightwavePanel',
  'SalesPanel',
  'SentientOutpostsPanel',
  'SortiePanel',
  'TimePanel',
  'VoidTraderPanel',
];

for (const name of panelFiles) {
  moves.push([`panels/${name}.tsx`, `panels/worldstate/${name}/${name}.component.tsx`]);
  moves.push([`panels/${name}.cy.tsx`, `panels/worldstate/${name}/${name}.cy.tsx`]);
}

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function moveFile(fromRel, toRel) {
  const from = join(root, fromRel);
  const to = join(root, toRel);
  try {
    await stat(from);
  } catch {
    console.warn(`skip missing: ${fromRel}`);
    return;
  }
  await ensureDir(dirname(to));
  await rename(from, to);
  console.log(`moved ${fromRel} -> ${toRel}`);
}

function componentNameFromPath(toRel) {
  const file = basename(toRel);
  return file.replace(/\.component\.tsx$/, '').replace(/\.cy\.tsx$/, '');
}

async function writeIndexForComponent(toRel) {
  if (!toRel.endsWith('.component.tsx')) return;
  const dir = dirname(join(root, toRel));
  const name = componentNameFromPath(toRel);
  const indexPath = join(dir, 'index.ts');
  await writeFile(indexPath, `export { default } from './${name}.component';\n`);
}

async function main() {
  for (const [from, to] of moves) {
    await moveFile(from, to);
    await writeIndexForComponent(to);
  }

  // Remove empty legacy dirs/files
  for (const orphan of ['DropdownNavItem.tsx', 'DropdownNavItem.less', 'Collapsible.tsx', 'Spoiler.tsx']) {
    try {
      const p = join(root, orphan);
      await stat(p);
      await rename(p, join(root, '_legacy', orphan));
      await ensureDir(join(root, '_legacy'));
    } catch {
      /* ignore */
    }
  }

  console.log('done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
