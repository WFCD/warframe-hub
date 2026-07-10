'use client';
import '../shared/ModalShell.component.scss';
import type { FC } from 'react';

import { Modal, Tabs, useOverlayState } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useHubModalPresentation } from '@/lib/hooks/useHubModalPresentation';
import GeneralFilter from '@/components/modals/filters/GeneralFilter';
import NotificationFilters from '@/components/modals/filters/NotificationFilters';
import FissureFilters from '@/components/modals/filters/FissureFilters';
import SoundFilters from '@/components/modals/filters/SoundFilters';

type Props = { show: boolean; onHide: () => void };
const SettingsModal: FC<Props> = ({ show, onHide }: Props) => {
  const { t } = useTranslation();
  const { placement, size } = useHubModalPresentation('xl');
  const state = useOverlayState({
    isOpen: show,
    onOpenChange: (isOpen) => {
      if (!isOpen) onHide();
    },
  });

  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container
          placement={placement}
          size={size}
          scroll="inside"
          className="hub-modal hub-modal--sheet hub-settings-modal"
        >
          <Modal.Dialog>
            <Tabs defaultSelectedKey="general">
              <Modal.Header className="hub-modal-header">
                <Modal.Heading className="hub-modal-title">{t('settings.header')}</Modal.Heading>
                <Tabs.ListContainer className="hub-modal-tabs">
                  <Tabs.List aria-label={t('settings.tabs.sectionsAria')}>
                    <Tabs.Tab id="general">{t('settings.tabs.general')}</Tabs.Tab>
                    <Tabs.Tab id="notifications">{t('settings.tabs.notifications')}</Tabs.Tab>
                    <Tabs.Tab id="fissures">{t('settings.tabs.fissures')}</Tabs.Tab>
                    <Tabs.Tab id="sounds">{t('settings.tabs.sounds')}</Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>
                <Modal.CloseTrigger className="hub-modal-close" />
              </Modal.Header>
              <Modal.Body>
                <Tabs.Panel id="general">
                  <GeneralFilter />
                </Tabs.Panel>
                <Tabs.Panel id="notifications">
                  <NotificationFilters />
                </Tabs.Panel>
                <Tabs.Panel id="fissures">
                  <FissureFilters />
                </Tabs.Panel>
                <Tabs.Panel id="sounds">
                  <SoundFilters />
                </Tabs.Panel>
              </Modal.Body>
            </Tabs>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
export default SettingsModal;
