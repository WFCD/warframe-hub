/**
 * Cross-tab worldstate poll leadership via Web Locks (BroadcastChannel fallback).
 * Only the leader should hit the network; followers read localStorage meta/data.
 */
const LOCK_NAME = 'hub.worldstate.poll';
const CHANNEL_NAME = 'hub.worldstate.poll';

type LeaderListener = (isLeader: boolean) => void;

let leader = false;
const listeners = new Set<LeaderListener>();
let started = false;
let channel: BroadcastChannel | null = null;
let lockAbort: AbortController | null = null;

const notify = (next: boolean) => {
  if (leader === next) return;
  leader = next;
  for (const listener of listeners) listener(leader);
};

const startBroadcastFallback = () => {
  if (typeof BroadcastChannel === 'undefined') {
    notify(true);
    return;
  }
  channel = new BroadcastChannel(CHANNEL_NAME);
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let knownLeader: string | null = null;

  const claim = () => {
    channel?.postMessage({ type: 'claim', id });
  };

  channel.onmessage = (event: MessageEvent<{ type: string; id?: string }>) => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'claim' && data.id) {
      if (!knownLeader || data.id < knownLeader || data.id === id) {
        knownLeader = data.id;
        notify(knownLeader === id);
      }
      return;
    }
    if (data.type === 'ping') claim();
  };

  claim();
  channel.postMessage({ type: 'ping' });
};

const startWebLock = () => {
  lockAbort = new AbortController();
  const run = async () => {
    try {
      await navigator.locks.request(
        LOCK_NAME,
        { signal: lockAbort?.signal, mode: 'exclusive' },
        async () => {
          notify(true);
          // Hold lock until aborted (tab close / stopPollLeadership)
          await new Promise<void>((resolve) => {
            lockAbort?.signal.addEventListener('abort', () => resolve(), { once: true });
          });
          notify(false);
        },
      );
    } catch {
      // Aborted or unsupported mid-flight — try fallback if we never led
      if (!leader) startBroadcastFallback();
    }
  };
  void run();
};

export const startPollLeadership = (listener: LeaderListener): (() => void) => {
  listeners.add(listener);
  listener(leader);

  if (!started) {
    started = true;
    if (typeof navigator !== 'undefined' && typeof navigator.locks?.request === 'function') {
      startWebLock();
    } else {
      startBroadcastFallback();
    }
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      lockAbort?.abort();
      lockAbort = null;
      channel?.close();
      channel = null;
      started = false;
      leader = false;
    }
  };
};

export const isPollLeader = (): boolean => leader;
