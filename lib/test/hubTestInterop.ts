import type { PointerEvent as ReactPointerEvent } from 'react';
import { isHubTestMode } from './dataMode';

const isPrimaryPointer = (event: ReactPointerEvent): boolean => {
  if (event.pointerType === 'mouse') return event.button === 0;
  return event.pointerType === 'touch' || event.pointerType === 'pen';
};

/** Pointer capture on a native wrapper — HeroUI may not forward capture props to the pressable. */
const runHubTestPointer = (event: ReactPointerEvent, handler: () => void): void => {
  if (!isHubTestMode() || !isPrimaryPointer(event)) return;
  event.preventDefault();
  event.stopPropagation();
  handler();
};

/** Always attach onPointerDownCapture so SSR/hydration DOM matches; only runs handler under hubTest. */
export const hubTestPointerProps = (handler: () => void): { onPointerDownCapture: (event: ReactPointerEvent) => void } => ({
  onPointerDownCapture: (event) => runHubTestPointer(event, handler),
});

export const hubTestClickHandler = (handler: () => void) => hubTestPointerProps(handler);

export const hubTestOpenHandler = (open: () => void) => hubTestPointerProps(open);
