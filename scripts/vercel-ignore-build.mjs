#!/usr/bin/env node
/**
 * Vercel Ignored Build Step.
 * Exit 0 = skip this build; exit 1 = continue.
 *
 * Preview deploys are owned by GitHub Actions (after CI passes).
 * Production builds from the Vercel Git integration still run.
 */
const env = process.env.VERCEL_ENV ?? '';

if (env === 'preview') {
  console.log('Skip Vercel Git preview — CI deploys preview after tests pass');
  process.exit(0);
}

process.exit(1);
