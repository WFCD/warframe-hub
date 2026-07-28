export type HubRuntimeEnv = {
  NEXT_PUBLIC_DSN?: string;
};

declare global {
  interface Window {
    __HUB_RUNTIME_ENV__?: HubRuntimeEnv;
  }
}

/** Prefer container-injected runtime env; fall back to build-time public env (e.g. Vercel). */
export const getRuntimeDsn = (): string => {
  if (typeof window !== 'undefined' && window.__HUB_RUNTIME_ENV__) {
    if (Object.hasOwn(window.__HUB_RUNTIME_ENV__, 'NEXT_PUBLIC_DSN')) {
      return window.__HUB_RUNTIME_ENV__.NEXT_PUBLIC_DSN ?? '';
    }
  }
  return process.env.NEXT_PUBLIC_DSN ?? '';
};
