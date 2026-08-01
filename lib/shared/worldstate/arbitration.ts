import dayjs from 'dayjs';
import type { WorldstateData } from '../types/worldstate';

export type ArbitrationData = {
  activation?: string;
  expiry?: string;
  enemy?: string;
  type?: string;
  typeKey?: string;
  node?: string;
  nodeKey?: string;
  expired?: boolean;
};

function parseInstant(value?: string): dayjs.Dayjs | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  if (value === '0') {
    return dayjs(0);
  }
  const parsed = dayjs(value);
  // Invalid API timestamps → epoch (same sentinel as literal "0").
  return parsed.isValid() ? parsed : dayjs(0);
}

/** True when arbitration is a live rotation, not API/initial placeholder data. */
export function isArbitrationActive(arbitration: unknown): boolean {
  if (!arbitration || typeof arbitration !== 'object') return false;

  const a = arbitration as ArbitrationData;
  if (a.expired === true) return false;

  const node = a.node ?? '';
  const nodeKey = a.nodeKey ?? '';
  if (node === 'Loading...' || a.enemy === 'Loading...' || a.type === 'Loading...') {
    return false;
  }
  if (nodeKey === 'SolNode000' || node === 'SolNode000') return false;
  if (a.enemy === 'Tenno' && (a.type === 'Unknown' || a.typeKey === 'Unknown')) return false;

  const activationAt = parseInstant(a.activation);
  if (activationAt && activationAt.year() <= 1971) return false;

  const expiryAt = parseInstant(a.expiry);
  if (!expiryAt) return false;
  if (expiryAt.year() > 9999) return false;

  return expiryAt.isAfter(dayjs());
}

export function stripInactiveArbitration<T extends WorldstateData>(ws: T): T {
  if (isArbitrationActive(ws.arbitration)) return ws;
  const { arbitration: _, ...rest } = ws;
  return rest as T;
}
