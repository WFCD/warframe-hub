'use client';

import type { FC } from 'react';
import { Button } from '@heroui/react';
import { useTranslation } from 'react-i18next';

type TimersLayoutToolbarProps = {
  editMode: boolean;
  onToggleEditMode: () => void;
};

const TimersLayoutToolbar: FC<TimersLayoutToolbarProps> = ({ editMode, onToggleEditMode }: TimersLayoutToolbarProps) => {
  const { t } = useTranslation();

  return (
    <div className="hub-chrome-shell hub-timers-layout-toolbar">
      {editMode ? <p className="hub-timers-layout-toolbar-hint">{t('timersLayout.editHint')}</p> : null}
      <Button
        variant={editMode ? 'primary' : 'secondary'}
        className="hub-timers-layout-toolbar-btn"
        onPress={onToggleEditMode}
      >
        {editMode ? (
          <>
            <i className="fas fa-check" aria-hidden /> {t('timersLayout.doneCustomizing')}
          </>
        ) : (
          <>
            <i className="fas fa-arrows-alt" aria-hidden /> {t('timersLayout.customize')}
          </>
        )}
      </Button>
    </div>
  );
};

export default TimersLayoutToolbar;
