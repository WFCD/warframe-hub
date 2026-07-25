#!/usr/bin/env node
/**
 * vinext bakes public/ paths into a Set for static serving. VitePWA writes
 * sw.js / workbox / registerSW / manifest into dist/client after that scan,
 * so vinext start 404s them. Patch server bundles to allowlist those files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = path.join(root, 'dist', 'client');
const serverDir = path.join(root, 'dist', 'server');

const required = ['/sw.js', '/registerSW.js', '/manifest.webmanifest'];
const workbox = fs
  .readdirSync(clientDir)
  .filter((name) => /^workbox-.*\.js$/.test(name))
  .map((name) => `/${name}`);

const extra = [...required, ...workbox];
for (const rel of extra) {
  if (!fs.existsSync(path.join(clientDir, rel.slice(1)))) {
    console.error(`Missing PWA asset dist/client${rel}`);
    process.exit(1);
  }
}

const patchFile = (filePath) => {
  const before = fs.readFileSync(filePath, 'utf8');
  const marker = '`/favicon.ico`';
  const start = before.indexOf('new Set([');
  if (start < 0) return false;

  // Prefer the Set that includes favicon (public files allowlist)
  let setStart = -1;
  let searchFrom = 0;
  while (true) {
    const idx = before.indexOf('new Set([', searchFrom);
    if (idx < 0) break;
    const end = before.indexOf('])', idx);
    if (end < 0) break;
    const slice = before.slice(idx, end + 2);
    if (slice.includes(marker) || slice.includes('`/runtime-env.js`')) {
      setStart = idx;
      break;
    }
    searchFrom = idx + 8;
  }
  if (setStart < 0) return false;

  const setEnd = before.indexOf('])', setStart);
  const setLiteral = before.slice(setStart, setEnd + 2);
  const missing = extra.filter((p) => !setLiteral.includes(`\`${p}\``));
  if (!missing.length) return false;

  const insert = missing.map((p) => `\`${p}\``).join(',');
  // Insert before closing ])
  const patched = before.slice(0, setEnd) + ',' + insert + before.slice(setEnd);
  fs.writeFileSync(filePath, patched);
  console.log(`Patched publicFiles in ${path.relative(root, filePath)}: ${missing.join(', ')}`);
  return true;
};

const targets = [];
for (const name of ['index.js', 'ssr/index.js']) {
  const full = path.join(serverDir, name);
  if (fs.existsSync(full)) targets.push(full);
}

let patched = 0;
for (const file of targets) {
  if (patchFile(file)) patched += 1;
}

if (!patched) {
  console.error('Could not locate vinext publicFiles Set to patch for PWA assets.');
  process.exit(1);
}
