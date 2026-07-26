#!/usr/bin/env node
/**
 * Post-build guard: static export must prerender every app route with zero skips.
 * Fails CI if a route would need a serverless fallback on Vercel.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = path.join(root, 'dist', 'client');
const manifestPath = path.join(root, 'dist', 'server', 'vinext-prerender.json');

const expected = [
  'index.html',
  'codex.html',
  'synthesis.html',
  'deimos/fish.html',
  'deimos/map.html',
  'poe/fish.html',
  'poe/map.html',
  'vallis/fish.html',
  'vallis/map.html',
  'riven/data.html',
  'ow/fish/howto.html',
];

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const skipped = manifest.routes.filter((r) => r.status === 'skipped');
if (skipped.length) {
  console.error('Prerender skipped routes (would need SSR on deploy):');
  for (const r of skipped) console.error(`  ${r.route}: ${r.reason}`);
  process.exit(1);
}

const missing = expected.filter((rel) => !fs.existsSync(path.join(clientDir, rel)));
if (missing.length) {
  console.error('Missing static HTML in dist/client:');
  for (const rel of missing) console.error(`  ${rel}`);
  process.exit(1);
}

const swPath = path.join(clientDir, 'sw.js');
if (!fs.existsSync(swPath)) {
  console.error('Missing service worker in dist/client/sw.js (Vercel outputDirectory would 404 /sw.js).');
  process.exit(1);
}

const workboxFiles = fs.readdirSync(clientDir).filter((name) => /^workbox-.*\.js$/.test(name));
if (!workboxFiles.length) {
  console.error('Missing workbox-*.js next to dist/client/sw.js.');
  process.exit(1);
}

const requiredAssets = ['/sw.js', '/registerSW.js', '/manifest.webmanifest', `/${workboxFiles[0]}`];
const serverBundles = ['index.js', 'ssr/index.js']
  .map((name) => path.join(root, 'dist', 'server', name))
  .filter((full) => fs.existsSync(full));

if (!serverBundles.length) {
  console.error('Missing dist/server bundles to validate PWA publicFiles allowlist.');
  process.exit(1);
}

let checked = 0;
for (const bundle of serverBundles) {
  const src = fs.readFileSync(bundle, 'utf8');
  // Only bundles that own the publicFiles Set need the PWA allowlist
  if (!src.includes('`/favicon.ico`') && !src.includes('`/runtime-env.js`')) continue;
  checked += 1;
  for (const asset of requiredAssets) {
    if (!src.includes(`\`${asset}\``)) {
      console.error(`${path.relative(root, bundle)} publicFiles missing ${asset} (run patch-pwa-public-files).`);
      process.exit(1);
    }
  }
}

if (!checked) {
  console.error('No dist/server bundle with publicFiles Set found for PWA allowlist check.');
  process.exit(1);
}

console.log(
  `Static deploy OK: ${expected.length} routes, 0 serverless fallbacks, SW + ${workboxFiles[0]}.`,
);
