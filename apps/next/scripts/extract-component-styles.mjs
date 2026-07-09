#!/usr/bin/env node
/**
 * Extract component-scoped CSS blocks into *.component.scss and slim global stylesheets.
 */
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = join(fileURLToPath(new URL('..', import.meta.url)));
const stylesRoot = join(appRoot, 'styles');
const componentsRoot = join(appRoot, 'components');

const bundles = [
  {
    out: 'chrome/ClientShell/ClientShell.component.scss',
    blocks: ['hub-theme-backdrop', 'hub-sacrifice-backdrop'],
    from: 'hub-theme',
  },
  {
    out: 'chrome/Navbar/Navbar.component.scss',
    blocks: [
      'hub-chrome-shell',
      'hub-navbar-shell',
      'hub-navbar',
      'hub-nav-link',
      'hub-nav-toggle',
      'hub-nav-icon-btn',
      'hub-navbar-brand',
      'hub-nav-popover',
      'hub-nav-section-title',
      'hub-nav-menu-link',
      'hub-navbar-inner',
      'hub-navbar-collapse',
      'hub-navbar-start',
      'hub-nav-toggle',
      'hub-nav-link',
      'hub-nav-icon-item',
      'hub-nav-icon',
      'hub-nav-flyout',
      'hub-nav-brand-icon',
      'hub-nav-chevron',
      'hub-nav-label-mobile',
      'hub-navbar-brand',
      'hub-nav-popover',
      'hub-nav-section',
      'hub-nav-section-title',
      'hub-nav-section-links',
      'hub-nav-menu-link',
      'hub-nav-dropdown-trigger',
      'hub-nav-icon-btn',
      'hub-nav-dropdown-popover',
    ],
    from: 'both',
  },
  {
    out: 'cycles/CycleTimers/CycleTimers.component.scss',
    blocks: [
      'hub-cycle-timers-shell',
      'hub-cycle-timers-bar',
      'hub-cycle-timers',
      'hub-cycle-timer-cell',
      'hub-cycle-timer-pill',
      'hub-cycle-timer-badge',
      'hub-time-badge--compact',
    ],
    from: 'globals',
  },
  {
    out: 'ui/TimeBadge/TimeBadge.component.scss',
    blocks: ['hub-time-badge', 'hub-standing-chip', 'hub-cycle-timer-badge'],
    from: 'globals',
  },
  {
    out: 'media/HubImg/HubImg.component.scss',
    blocks: ['hub-img', 'hub-inline-row', 'hub-inline-title', 'center-block'],
    from: 'globals',
  },
  {
    out: 'panels/shared/HubPanelWrap/HubPanelWrap.component.scss',
    blocks: [
      'hub-panel-surface',
      'hub-panel-header',
      'hub-panel-title',
      'hub-panel-content',
      'hub-panel-row',
      'hub-empty-state',
      'hub-badge-row',
      'hub-table-header-icon',
      'masonry-grid',
      'binpacker-item',
    ],
    from: 'both',
  },
  {
    out: 'modals/shared/ModalShell.component.scss',
    blocks: ['hub-modal-header', 'hub-modal-title', 'hub-modal-tabs', 'hub-modal-close', 'hub-modal '],
    from: 'globals',
  },
  {
    out: 'modals/AboutModal/AboutModal.component.scss',
    blocks: ['hub-about-panel', 'hub-about-paragraph', 'hub-about-banner'],
    from: 'globals',
  },
  {
    out: 'ui/HubSwitch/HubSwitch.component.scss',
    blocks: ['hub-switch'],
    from: 'hub-theme',
  },
  {
    out: 'ui/HubRadioGroup/HubRadioGroup.component.scss',
    blocks: ['hub-radio-group', 'hub-radio', 'themeTabWrapper', 'platform-radios'],
    from: 'hub-theme',
  },
  {
    out: 'ui/HubTrackableMultiSelect/HubTrackableMultiSelect.component.scss',
    blocks: ['hub-settings-section', 'hub-settings-general', 'hub-settings-field', 'hub-settings-select', 'hub-settings-notifications', 'hub-settings-multiselect'],
    from: 'hub-theme',
  },
  {
    out: 'panels/shared/BountyJobsTable/BountyJobsTable.component.scss',
    blocks: ['hub-bounty-'],
    from: 'hub-theme',
    prefix: true,
  },
  {
    out: 'panels/worldstate/EventsPanel/EventsPanel.component.scss',
    blocks: ['hub-events-', 'hub-event-'],
    from: 'hub-theme',
    prefix: true,
  },
  {
    out: 'panels/shared/InvasionItem/InvasionItem.component.scss',
    blocks: ['hub-invasion-'],
    from: 'hub-theme',
    prefix: true,
  },
  {
    out: 'panels/worldstate/ConstructionPanel/ConstructionPanel.component.scss',
    blocks: ['hub-construction-row', 'construction .construction-wrapper'],
    from: 'hub-theme',
  },
  {
    out: 'panels/worldstate/FissuresPanel/FissuresPanel.component.scss',
    blocks: ['hub-fissure-'],
    from: 'globals',
    prefix: true,
  },
  {
    out: 'panels/worldstate/NightwavePanel/NightwavePanel.component.scss',
    blocks: ['nightwave .hub-panel-list-item'],
    from: 'globals',
  },
  {
    out: 'pages/TimersPage/TimersPage.component.scss',
    blocks: ['grid.hub-timers-grid', 'hub-chrome-shell.hub-timers-grid'],
    from: 'layout',
  },
  {
    out: 'maps/BaseMap/BaseMap.component.scss',
    blocks: ['map-label', 'leaflet-container'],
    from: 'both',
  },
];

function extractRules(css, selector) {
  const rules = [];
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`([^{}]*${escaped}[^{}]*\\{[^}]*\\})`, 'g');
  let m;
  while ((m = re.exec(css)) !== null) {
    rules.push(m[1].trim());
  }
  return rules;
}

function extractByPrefix(css, prefix) {
  const lines = css.split('\n');
  const out = [];
  let buf = [];
  let depth = 0;
  for (const line of lines) {
    if (line.includes(prefix) && depth === 0) {
      buf = [line];
      depth += (line.match(/\{/g) || []).length;
      depth -= (line.match(/\}/g) || []).length;
      if (depth === 0 && buf.length) {
        out.push(buf.join('\n'));
        buf = [];
      }
      continue;
    }
    if (buf.length) {
      buf.push(line);
      depth += (line.match(/\{/g) || []).length;
      depth -= (line.match(/\}/g) || []).length;
      if (depth <= 0) {
        out.push(buf.join('\n'));
        buf = [];
        depth = 0;
      }
    }
  }
  return out.join('\n\n');
}

async function main() {
  const globals = await readFile(join(stylesRoot, 'hub-globals.scss'), 'utf8');
  const hubTheme = await readFile(join(stylesRoot, 'hub-chrome.scss'), 'utf8');
  const layout = await readFile(join(stylesRoot, 'hub-layout.scss'), 'utf8');

  const source = (name) => {
    if (name === 'globals') return globals;
    if (name === 'hub-theme') return hubTheme;
    if (name === 'layout') return layout;
    return `${globals}\n${hubTheme}`;
  };

  for (const bundle of bundles) {
    const css = source(bundle.from);
    let content = '';
    if (bundle.prefix) {
      for (const block of bundle.blocks) {
        content += `${extractByPrefix(css, block)}\n\n`;
      }
    } else {
      for (const block of bundle.blocks) {
        const rules = extractRules(css, block);
        if (rules.length) content += `${rules.join('\n\n')}\n\n`;
      }
    }
    if (!content.trim()) continue;
    const outPath = join(componentsRoot, bundle.out);
    await writeFile(outPath, `/* ${bundle.out} */\n${content.trim()}\n`);
    console.log('wrote', bundle.out);
  }

  // hub.scss is the single entry; hub-globals.scss and hub-chrome.scss are imported there.

  const lessImports = [
    ['chrome/ClientShell/ClientShell.component.tsx', './ClientShell.component.scss'],
    ['chrome/Navbar/Navbar.component.tsx', './Navbar.component.scss'],
    ['cycles/CycleTimers/CycleTimers.component.tsx', './CycleTimers.component.scss'],
    ['ui/TimeBadge/TimeBadge.component.tsx', './TimeBadge.component.scss'],
    ['media/HubImg/HubImg.component.tsx', './HubImg.component.scss'],
    ['panels/shared/HubPanelWrap/HubPanelWrap.component.tsx', './HubPanelWrap.component.scss'],
    ['modals/AboutModal/AboutModal.component.tsx', '../shared/ModalShell.component.scss'],
    ['modals/AboutModal/AboutModal.component.tsx', './AboutModal.component.scss'],
    ['modals/SettingsModal/SettingsModal.component.tsx', '../shared/ModalShell.component.scss'],
    ['ui/HubSwitch/HubSwitch.component.tsx', './HubSwitch.component.scss'],
    ['ui/HubRadioGroup/HubRadioGroup.component.tsx', './HubRadioGroup.component.scss'],
    ['ui/HubTrackableMultiSelect/HubTrackableMultiSelect.component.tsx', './HubTrackableMultiSelect.component.scss'],
    ['panels/shared/BountyJobsTable/BountyJobsTable.component.tsx', './BountyJobsTable.component.scss'],
    ['panels/worldstate/EventsPanel/EventsPanel.component.tsx', './EventsPanel.component.scss'],
    ['panels/shared/InvasionItem/InvasionItem.component.tsx', './InvasionItem.component.scss'],
    ['panels/worldstate/ConstructionPanel/ConstructionPanel.component.tsx', './ConstructionPanel.component.scss'],
    ['panels/worldstate/FissuresPanel/FissuresPanel.component.tsx', './FissuresPanel.component.scss'],
    ['panels/worldstate/NightwavePanel/NightwavePanel.component.tsx', './NightwavePanel.component.scss'],
    ['pages/TimersPage/TimersPage.component.tsx', './TimersPage.component.scss'],
    ['maps/BaseMap/BaseMap.component.tsx', './BaseMap.component.scss'],
    ['ui/NoDataItem/NoDataItem.component.tsx', '@/components/panels/shared/HubPanelWrap/HubPanelWrap.component.scss'],
  ];

  for (const [rel, lessImport] of lessImports) {
    const file = join(componentsRoot, rel);
    let content = await readFile(file, 'utf8');
    const stmt = `import '${lessImport}';`;
    if (content.includes(lessImport)) continue;
    content = content.replace("'use client';", `'use client';\n${stmt}`);
    await writeFile(file, content);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
