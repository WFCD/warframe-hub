'use client';

import type { CSSProperties, FC, ReactNode } from 'react';
import { Tooltip } from '@heroui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';
import { HUB_TOOLTIP_DELAY } from '@/lib/ui/tooltipTiming';

type SortableTimerPanelProps = {
  id: string;
  editMode: boolean;
  compact?: boolean;
  visible?: boolean;
  onToggleVisible?: () => void;
  children: ReactNode;
};

const SortableTimerPanel: FC<SortableTimerPanelProps> = ({
  id,
  editMode,
  compact = false,
  visible = true,
  onToggleVisible,
  children,
}: SortableTimerPanelProps) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !editMode,
  });

  const style: CSSProperties = isDragging
    ? { opacity: compact ? 0.45 : 0.2 }
    : {
      transform: CSS.Translate.toString(transform),
      transition,
    };

  const visibilityLabel = visible ? t('timersLayout.hidePanel') : t('timersLayout.showPanel');
  const dragLabel = t('timersLayout.dragToReorder');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'hub-timer-panel-slot',
        editMode ? 'hub-timer-panel-slot--edit' : '',
        compact ? 'hub-timer-panel-slot--compact' : '',
        isDragging ? 'hub-timer-panel-slot--dragging' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {editMode ? (
        <>
          <Tooltip delay={HUB_TOOLTIP_DELAY}>
            <Tooltip.Trigger>
              <button
                type='button'
                className='hub-timer-panel-visibility-btn'
                aria-label={visibilityLabel}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleVisible?.();
                }}
              >
                <i className={`fas ${visible ? 'fa-eye' : 'fa-eye-slash'}`} aria-hidden />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content>{visibilityLabel}</Tooltip.Content>
          </Tooltip>
          <Tooltip delay={HUB_TOOLTIP_DELAY}>
            <Tooltip.Trigger>
              <button
                type='button'
                className='hub-timer-panel-drag-handle'
                aria-label={dragLabel}
                {...attributes}
                {...listeners}
              >
                <i className='fas fa-grip-vertical' aria-hidden />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content>{dragLabel}</Tooltip.Content>
          </Tooltip>
        </>
      ) : null}
      <div className='hub-timer-panel-slot-content'>{children}</div>
    </div>
  );
};

export default SortableTimerPanel;
