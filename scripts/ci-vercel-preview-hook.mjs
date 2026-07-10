#!/usr/bin/env node
/**
 * After CI passes:
 * 1. Create ephemeral Deploy Hook for PR branch
 * 2. POST it
 * 3. Delete hook
 * 4. Poll Vercel until deployment for this commit SHA is READY
 * 5. Print preview URL + deployment id for GitHub Actions
 *
 * Env (required): VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, BRANCH, COMMIT_SHA
 * Env (optional): HOOK_NAME, POLL_TIMEOUT_MS (default 600000), POLL_INTERVAL_MS (default 5000)
 */
import { spawnSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

const token = process.env.VERCEL_TOKEN;
const orgId = process.env.VERCEL_ORG_ID;
const projectId = process.env.VERCEL_PROJECT_ID;
const branch = process.env.BRANCH;
const commitSha = process.env.COMMIT_SHA;
const hookName = process.env.HOOK_NAME || `ci-preview-${Date.now()}`;
const pollTimeoutMs = Number(process.env.POLL_TIMEOUT_MS || 600_000);
const pollIntervalMs = Number(process.env.POLL_INTERVAL_MS || 5_000);
const githubOutput = process.env.GITHUB_OUTPUT;

if (!token || !orgId || !projectId || !branch || !commitSha) {
  console.error('Missing VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, BRANCH, and/or COMMIT_SHA');
  process.exit(1);
}

const withAuth = (args) => [...args, '--token', token, '--scope', orgId];

const run = (args, { allowFail = false } = {}) => {
  const result = spawnSync('vercel', withAuth(args), {
    encoding: 'utf8',
    env: process.env,
  });
  const stdout = result.stdout ?? '';
  const stderr = result.stderr ?? '';
  if (result.status !== 0 && !allowFail) {
    console.error(stderr || stdout || `vercel ${args.join(' ')} failed`);
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

const vercelApi = async (path) => {
  const url = new URL(path, 'https://api.vercel.com');
  if (!url.searchParams.has('teamId') && orgId) {
    url.searchParams.set('teamId', orgId);
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Vercel API ${res.status} ${url.pathname}: ${text}`);
  }
  return text ? JSON.parse(text) : {};
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const matchesCommit = (deployment) => {
  const meta = deployment.meta ?? {};
  const sha =
    meta.githubCommitSha ||
    meta.gitCommitSha ||
    deployment.gitSource?.sha ||
    '';
  return typeof sha === 'string' && sha.toLowerCase() === commitSha.toLowerCase();
};

const findDeploymentForSha = async () => {
  // Prefer sha filter when supported; also list recent and match meta.
  const qs = new URLSearchParams({
    projectId,
    teamId: orgId,
    limit: '20',
  });
  const data = await vercelApi(`/v6/deployments?${qs}`);
  const deployments = data.deployments ?? [];
  const match = deployments.find(matchesCommit);
  return match ?? null;
};

const waitForReady = async () => {
  const deadline = Date.now() + pollTimeoutMs;
  let lastState = 'unknown';

  while (Date.now() < deadline) {
    const deployment = await findDeploymentForSha();
    if (deployment) {
      lastState = deployment.readyState || deployment.state || 'unknown';
      console.log(`Deployment ${deployment.uid || deployment.id}: ${lastState}`);

      if (lastState === 'READY') {
        const url = deployment.url ? `https://${deployment.url}` : deployment.inspectorUrl;
        return {
          id: deployment.uid || deployment.id,
          url,
          inspectorUrl: deployment.inspectorUrl,
          state: lastState,
        };
      }

      if (lastState === 'ERROR' || lastState === 'CANCELED') {
        throw new Error(`Vercel deployment ended in ${lastState}`);
      }
    } else {
      console.log(`No deployment yet for ${commitSha.slice(0, 7)}…`);
    }

    await sleep(pollIntervalMs);
  }

  throw new Error(`Timed out after ${pollTimeoutMs}ms waiting for READY (last=${lastState})`);
};

const writeOutput = (key, value) => {
  if (!githubOutput || value == null) return;
  appendFileSync(githubOutput, `${key}=${value}\n`);
};

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
    console.error(createdText);
    process.exit(1);
  }
  if (!hookId && hook) {
    hookId = hook.id ?? hook.uid;
  }

  console.log(`Triggering hook for ${branch} @ ${commitSha}`);
  const res = await fetch(hookUrl, { method: 'POST' });
  const body = await res.text();
  if (!res.ok) {
    console.error(`Hook POST failed (${res.status}): ${body}`);
    process.exit(1);
  }
  console.log(`Hook accepted: ${body}`);
} finally {
  const remove = (id) => {
    console.log(`Removing deploy hook ${id}`);
    run(['deploy-hooks', 'rm', id, '--yes', '--project', projectId], { allowFail: true });
  };

  if (hookId) {
    remove(hookId);
  } else {
    const leftover = findHook(hookName);
    const id = leftover?.id ?? leftover?.uid;
    if (id) remove(id);
    else console.warn(`No hook id to remove for "${hookName}"`);
  }
}

const ready = await waitForReady();
console.log(`preview_url=${ready.url}`);
console.log(`deployment_id=${ready.id}`);

writeOutput('preview_url', ready.url);
writeOutput('deployment_id', ready.id);
writeOutput('inspector_url', ready.inspectorUrl ?? '');
