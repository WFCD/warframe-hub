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
  if (typeof window !== 'undefined') {
    const runtime = window.__HUB_RUNTIME_ENV__?.NEXT_PUBLIC_DSN;
    if (runtime) return runtime;
  }
  return process.env.NEXT_PUBLIC_DSN ?? '';
};
