#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const resolveSpec = (file) => {
  const abs = resolve(repoRoot, file);
  if (abs.endsWith('.cy.tsx')) return abs;
  const match = abs.match(/(.+)\.component\.(tsx|scss)$/);
  if (!match) return null;
  const spec = `${match[1]}.cy.tsx`;
  return existsSync(spec) ? spec : null;
};

const files = process.argv.slice(2).filter((file) => file.startsWith('apps/next/components/'));
const specs = [...new Set(files.map(resolveSpec).filter(Boolean))];

if (specs.length === 0) {
  process.exit(0);
}

const specArg = specs.map((spec) => spec.slice(repoRoot.length + 1)).join(',');

const result = spawnSync(
  'npm',
  ['run', 'test:component', '--prefix', 'apps/next', '--', '--spec', specArg],
  { cwd: repoRoot, stdio: 'inherit' }
);

process.exit(result.status ?? 1);
