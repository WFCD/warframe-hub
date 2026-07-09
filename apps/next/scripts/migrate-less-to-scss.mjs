#!/usr/bin/env node
/**
 * One-shot migration: apps/next LESS (+ global CSS) → SCSS.
 */
import { readFile, writeFile, readdir, unlink, rename, mkdir } from 'node:fs/promises';
import { join, dirname, relative, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = join(fileURLToPath(new URL('..', import.meta.url)));

const SCSS_AT_RULES = new Set([
  'import',
  'use',
  'forward',
  'include',
  'mixin',
  'function',
  'return',
  'extend',
  'media',
  'keyframes',
  'font-face',
  'charset',
  'layer',
  'supports',
  'container',
  'scope',
  'at-root',
  'error',
  'warn',
  'debug',
  'if',
  'else',
  'each',
  'for',
  'while',
]);

function convertLessToScss(content, filePath) {
  let out = content;

  out = out.replace(/@import\s+\(css\)\s+['"]([^'"]+)['"]\s*;?/g, "@import url('$1');");

  out = out.replace(/@import\s+['"]([^'"]+)\.less['"]\s*;?/g, (_, p) => {
    const normalized = p.replace(/^\.\//, '').replace(/^\.\.\//, '../');
    return `@import '${normalized}';\n`;
  });

  out = out.replace(/@import\s+['"]([^'"]+)['"]\s*;?/g, (match, p) => {
    if (p.endsWith('.css') || p.startsWith('@') || p.includes('://')) return match;
    if (p.endsWith('.less')) return match;
    return match;
  });

  out = out.replace(/@([a-zA-Z_-][\w-]*)/g, (match, name) => {
    if (SCSS_AT_RULES.has(name)) return match;
    return `$${name}`;
  });

  out = out.replace(/\.less\b/g, '.scss');
  out = out.replace(/\/less\//g, '/scss/');

  return out;
}

async function walk(dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    if (entry.isDirectory()) await walk(full, acc);
    else if (entry.name.endsWith('.less')) acc.push(full);
  }
  return acc;
}

async function migrateLessFiles() {
  const lessFiles = await walk(appRoot);
  for (const file of lessFiles) {
    const content = await readFile(file, 'utf8');
    const scssPath = file.replace(/\.less$/, '.scss');
    await mkdir(dirname(scssPath), { recursive: true });
    await writeFile(scssPath, convertLessToScss(content, file));
    await unlink(file);
    console.log('less→scss', relative(appRoot, scssPath));
  }
}

const CSS_TO_SCSS = [
  'styles/globals.css',
  'styles/hub-theme.css',
  'styles/hub-links.css',
  'styles/hub-utilities.css',
  'styles/hub-tokens/index.css',
  'styles/hub-tokens/primitives.css',
  'styles/hub-tokens/links.css',
  'styles/hub-tokens/sacrifice-dark.css',
  'styles/hub-tokens/eidolon.css',
  'styles/hub-tokens/day.css',
  'styles/hub-tokens/retro.css',
];

async function migrateCssFiles() {
  for (const rel of CSS_TO_SCSS) {
    const cssPath = join(appRoot, rel);
    try {
      const content = await readFile(cssPath, 'utf8');
      const scssPath = cssPath.replace(/\.css$/, '.scss');
      await writeFile(scssPath, convertLessToScss(content, cssPath));
      await unlink(cssPath);
      console.log('css→scss', relative(appRoot, scssPath));
    } catch {
      // already migrated or missing
    }
  }
}

async function renameLessDir() {
  const lessDir = join(appRoot, 'styles/less');
  const scssDir = join(appRoot, 'styles/scss');
  try {
    await rename(lessDir, scssDir);
    console.log('renamed styles/less → styles/scss');
  } catch {
    // already renamed
  }
}

async function writeHubScss() {
  const hubScss = `// Single style entry — vendor CSS, tokens, globals, legacy class themes.
@import url('@heroui/styles');
@import 'tailwindcss';

@import 'hub-tokens/index';
@import 'hub-chrome';
@import 'hub-links';
@import 'hub-utilities';
@import 'hub-globals';

@import 'scss/Warframe-symbols';
@import 'scss/common';
@import 'scss/tables';
@import 'scss/night';
@import 'scss/retro';
@import 'scss/eidolon';
@import 'scss/day';
@import 'scss/compact';
@import 'hub-layout';
@import 'hub-theme-bridge';
`;
  await writeFile(join(appRoot, 'styles/hub.scss'), hubScss);

  try {
    await unlink(join(appRoot, 'styles/hub.less'));
  } catch {
    /* noop */
  }
  console.log('wrote styles/hub.scss');
}

async function renameHubBridge() {
  const from = join(appRoot, 'styles/hub-theme-bridge.less');
  const to = join(appRoot, 'styles/hub-theme-bridge.scss');
  try {
    const content = await readFile(from, 'utf8');
    await writeFile(to, convertLessToScss(content, from));
    await unlink(from);
    console.log('hub-theme-bridge.less → .scss');
  } catch {
    /* noop */
  }
}

async function renameHubLayout() {
  const from = join(appRoot, 'styles/hub-layout.less');
  const to = join(appRoot, 'styles/hub-layout.scss');
  try {
    const content = await readFile(from, 'utf8');
    await writeFile(to, convertLessToScss(content, from));
    await unlink(from);
    console.log('hub-layout.less → .scss');
  } catch {
    /* noop */
  }
}

async function renameHubChrome() {
  const from = join(appRoot, 'styles/hub-theme.css');
  const to = join(appRoot, 'styles/hub-chrome.scss');
  try {
    const content = await readFile(from, 'utf8');
    await writeFile(to, content);
    await unlink(from);
    console.log('hub-theme.css → hub-chrome.scss');
  } catch {
    const alt = join(appRoot, 'styles/hub-theme.scss');
    try {
      await rename(alt, to);
      console.log('hub-theme.scss → hub-chrome.scss');
    } catch {
      /* noop */
    }
  }
}

async function renameHubGlobals() {
  const from = join(appRoot, 'styles/globals.css');
  const to = join(appRoot, 'styles/hub-globals.scss');
  try {
    let content = await readFile(from, 'utf8');
    content = content
      .replace(/@import "@heroui\/styles";\n?/, '')
      .replace(/@import "\.\/hub-tokens\/index\.css";\n?/, '')
      .replace(/@import "\.\/hub-links\.css";\n?/, '')
      .replace(/@import "\.\/hub-utilities\.css";\n?/, '');
    await writeFile(to, convertLessToScss(content, from));
    await unlink(from);
    console.log('globals.css → hub-globals.scss');
  } catch {
    const alt = join(appRoot, 'styles/globals.scss');
    try {
      let content = await readFile(alt, 'utf8');
      await writeFile(to, content);
      await unlink(alt);
    } catch {
      /* noop */
    }
  }
}

async function patchTsxImports() {
  const tsxFiles = [];
  async function walkTsx(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules') await walkTsx(full);
      else if (/\.tsx$/.test(entry.name)) tsxFiles.push(full);
    }
  }
  await walkTsx(join(appRoot, 'components'));
  await walkTsx(join(appRoot, 'app'));

  for (const file of tsxFiles) {
    let content = await readFile(file, 'utf8');
    const next = content
      .replace(/\.component\.less/g, '.component.scss')
      .replace(/ModalShell\.component\.less/g, 'ModalShell.component.scss')
      .replace(/@\/styles\/hub\.less/g, '@/styles/hub.scss')
      .replace(/@\/styles\/globals\.css/g, '')
      .replace(/@\/styles\/hub-theme\.css/g, '')
      .replace(/\nimport '';\n/g, '\n');
    if (next !== content) {
      await writeFile(file, next);
      console.log('patched', relative(appRoot, file));
    }
  }
}

async function patchHubTokensIndex() {
  const indexPath = join(appRoot, 'styles/hub-tokens/index.scss');
  try {
    let content = await readFile(indexPath, 'utf8');
    content = content.replace(/\.css/g, '.scss').replace(/\.less/g, '.scss');
    await writeFile(indexPath, content);
  } catch {
    const content = `/* Hub themes — CSS variables only. */
@import 'primitives';
@import 'links';
@import 'sacrifice-dark';
@import 'eidolon';
@import 'day';
@import 'retro';

:root {
  --hub-theme-backdrop-display: none;
  --hub-theme-backdrop-image: none;
  --hub-theme-backdrop-overlay: transparent;
  --hub-mission-icon-filter: invert(100%);
  --hub-glyph-invert-filter: brightness(0) invert(1);
}
`;
    await writeFile(indexPath, content);
  }
}

async function main() {
  await migrateCssFiles();
  await renameHubGlobals();
  await renameHubChrome();
  await migrateLessFiles();
  await renameLessDir();
  await renameHubLayout();
  await renameHubBridge();
  await patchHubTokensIndex();
  await writeHubScss();
  await patchTsxImports();
  console.log('done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
