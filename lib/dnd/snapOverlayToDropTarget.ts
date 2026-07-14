import type { Modifier } from '@dnd-kit/core';

/** Snap drag overlay to the hovered masonry slot so the preview shows where the panel will land. */
export const snapOverlayToDropTarget: Modifier = ({ activeNodeRect, transform, over }) => {
  if (!over?.id || !activeNodeRect) return { ...transform, scaleX: 1, scaleY: 1 };

  const overEl = document.querySelector(`[data-timer-panel="${String(over.id)}"]`);
  if (!overEl) return { ...transform, scaleX: 1, scaleY: 1 };

  const target = overEl.getBoundingClientRect();

  return {
    x: target.left - activeNodeRect.left,
    y: target.top - activeNodeRect.top,
    scaleX: 1,
    scaleY: 1,
  };
};
