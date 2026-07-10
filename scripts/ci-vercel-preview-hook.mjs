#!/usr/bin/env node
/**
 * After CI passes: create a Deploy Hook for the PR branch, trigger it, then delete the hook.
 * Avoids git-author amend and keeps auto Git deploys off via vercel.json git.deploymentEnabled.
 *
 * Env:
 *   VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID (required)
 *   BRANCH — git branch to deploy (required)
 *   HOOK_NAME — unique hook name (default: ci-preview-<timestamp>)
 */
import { spawnSync } from 'node:child_process';

const token = process.env.VERCEL_TOKEN;
const orgId = process.env.VERCEL_ORG_ID;
const projectId = process.env.VERCEL_PROJECT_ID;
const branch = process.env.BRANCH;
const hookName = process.env.HOOK_NAME || `ci-preview-${Date.now()}`;

if (!token || !orgId || !projectId || !branch) {
  console.error('Missing VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, and/or BRANCH');
  process.exit(1);
}

const vercelArgs = (args) => [
  ...args,
  '--token',
  token,
  '--scope',
  orgId,
  '--yes',
];

const run = (args, { allowFail = false } = {}) => {
  const result = spawnSync('vercel', vercelArgs(args), {
    encoding: 'utf8',
    env: process.env,
  });
  const stdout = result.stdout ?? '';
  const stderr = result.stderr ?? '';
  if (result.status !== 0 && !allowFail) {
    console.error(stderr || stdout || `vercel ${args[0]} failed`);
    process.exit(result.status ?? 1);
  }
  return { stdout, stderr, status: result.status ?? 1 };
};

const extractUrl = (text) => {
  const match = text.match(/https:\/\/api\.vercel\.com\/v1\/integrations\/deploy\/[^\s"'<>]+/);
  return match?.[0] ?? null;
};

const listHooks = () => {
  const { stdout, stderr } = run(['deploy-hooks', 'ls', '--format', 'json', '--project', projectId], {
    allowFail: true,
  });
  const raw = stdout.trim() || stderr.trim();
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : (parsed?.hooks ?? parsed?.deployHooks ?? []);
  } catch {
    console.warn('Could not parse deploy-hooks ls JSON; raw:', raw.slice(0, 500));
    return [];
  }
};

const findHook = (name) => listHooks().find((h) => h.name === name || h.ref === branch);

let hookId = null;
let hookUrl = null;

try {
  console.log(`Creating deploy hook "${hookName}" for ref ${branch}`);
  const created = run(['deploy-hooks', 'create', hookName, '--ref', branch, '--project', projectId]);
  const createdText = `${created.stdout}\n${created.stderr}`;
  hookUrl = extractUrl(createdText);

  const hook = findHook(hookName);
  hookId = hook?.id ?? hook?.uid ?? null;
  if (!hookUrl) {
    hookUrl = hook?.url ?? hook?.link ?? null;
  }
  if (!hookUrl) {
    console.error('Deploy hook created but URL not found in CLI output');
    process.exit(1);
  }
  if (!hookId && hook) {
    hookId = hook.id ?? hook.uid;
  }

  console.log(`Triggering hook for ${branch}`);
  const res = await fetch(hookUrl, { method: 'POST' });
  const body = await res.text();
  if (!res.ok) {
    console.error(`Hook POST failed (${res.status}): ${body}`);
    process.exit(1);
  }
  console.log(`Hook accepted: ${body}`);

  // Best-effort: surface job id for Actions summary
  try {
    const json = JSON.parse(body);
    if (json?.job?.id) {
      console.log(`job_id=${json.job.id}`);
    }
  } catch {
    /* ignore */
  }

  console.log(`branch=${branch}`);
  console.log(`triggered=1`);
} finally {
  if (hookId) {
    console.log(`Removing deploy hook ${hookId}`);
    run(['deploy-hooks', 'rm', hookId, '--project', projectId], { allowFail: true });
  } else {
    const leftover = findHook(hookName);
    const id = leftover?.id ?? leftover?.uid;
    if (id) {
      console.log(`Removing deploy hook ${id} (lookup by name)`);
      run(['deploy-hooks', 'rm', id, '--project', projectId], { allowFail: true });
    } else {
      console.warn(`No hook id to remove for "${hookName}" — check Vercel dashboard if hooks accumulate`);
    }
  }
}
