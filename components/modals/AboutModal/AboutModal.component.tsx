'use client';
import './AboutModal.component.scss';
import '../shared/ModalShell.component.scss';

import type { FC, ReactNode } from 'react';
import { Link, Modal, Tabs, useOverlayState } from '@heroui/react';
import { Trans, useTranslation } from 'react-i18next';
import { useHubModalPresentation } from '@/lib/hooks/useHubModalPresentation';
import { hubTestClickHandler } from '@/lib/test/hubTestInterop';

type Props = { show: boolean; onHide: () => void };

const AboutParagraph: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => (
  <p className='hub-about-paragraph'>{children}</p>
);

const AboutModal: FC<Props> = ({ show, onHide }: Props) => {
  const { t } = useTranslation();
  const { placement, size } = useHubModalPresentation('lg');
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
          scroll='inside'
          className='hub-modal hub-modal--sheet hub-about-modal'
        >
          <Modal.Dialog>
            <Tabs defaultSelectedKey='community'>
              <Modal.Header className='hub-modal-header'>
                <Modal.Heading className='hub-modal-title'>{t('about.header')}</Modal.Heading>
                <Tabs.ListContainer className='hub-modal-tabs'>
                  <Tabs.List aria-label={t('about.tabs.sectionsAria')}>
                    <Tabs.Tab id='community'>{t('about.tabs.community')}</Tabs.Tab>
                    <Tabs.Tab id='license'>{t('about.tabs.license')}</Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>
                <Modal.CloseTrigger className='hub-modal-close' {...hubTestClickHandler(onHide)} />
              </Modal.Header>
              <Modal.Body>
                <Tabs.Panel id='community' className='hub-about-panel'>
                  <AboutParagraph>{t('about.communityIntro')}</AboutParagraph>
                  <AboutParagraph>
                    <Trans
                      i18nKey='about.communityGithub'
                      components={{
                        githubLink: (
                          <Link
                            className='hub-about-link'
                            href='https://github.com/WFCD/warframe-hub'
                            target='_blank'
                            rel='noopener noreferrer'
                          />
                        ),
                      }}
                    />
                  </AboutParagraph>
                  <div className='hub-about-banner-wrap'>
                    <Link href='https://github.com/WFCD' target='_blank' rel='noopener noreferrer'>
                      <img
                        className='hub-about-banner'
                        src='https://docs.warframestat.us/wfcd_logo_color.png'
                        alt={t('about.wfcdBannerAlt')}
                      />
                    </Link>
                  </div>
                  <AboutParagraph>
                    <Trans
                      i18nKey='about.pullRequests'
                      components={{
                        issueLink: (
                          <Link
                            href='https://github.com/WFCD/warframe-hub/issues'
                            target='_blank'
                            rel='noopener noreferrer'
                          />
                        ),
                      }}
                    />
                  </AboutParagraph>
                </Tabs.Panel>

                <Tabs.Panel id='license' className='hub-about-panel'>
                  <AboutParagraph>
                    <Trans
                      i18nKey='about.licenseIntro'
                      components={{
                        wfcdLink: (
                          <Link href='https://github.com/wfcd' target='_blank' rel='noopener noreferrer' />
                        ),
                      }}
                    />
                  </AboutParagraph>
                  <AboutParagraph>
                    <Trans
                      i18nKey='about.licenseApache'
                      components={{
                        apacheLink: (
                          <Link
                            href='https://www.apache.org/licenses/LICENSE-2.0'
                            target='_blank'
                            rel='noopener noreferrer'
                          />
                        ),
                      }}
                    />
                  </AboutParagraph>
                  <AboutParagraph>{t('about.trademark')}</AboutParagraph>
                  <AboutParagraph>
                    <Trans
                      i18nKey='about.accuracy'
                      components={{
                        issueLink: (
                          <Link
                            href='https://github.com/WFCD/warframe-hub/issues/new/choose'
                            target='_blank'
                            rel='noopener noreferrer'
                          />
                        ),
                      }}
                    />
                  </AboutParagraph>
                  <AboutParagraph>
                    <Trans
                      i18nKey='about.modify'
                      components={{
                        licenseLink: (
                          <Link
                            href='https://choosealicense.com/licenses/apache-2.0/'
                            target='_blank'
                            rel='noopener noreferrer'
                          />
                        ),
                      }}
                    />
                  </AboutParagraph>
                  <AboutParagraph>
                    <Trans
                      i18nKey='about.cacheHelp'
                      components={{
                        cacheLink: (
                          <Link
                            href='https://www.refreshyourcache.com/en/home/'
                            target='_blank'
                            rel='noopener noreferrer'
                          />
                        ),
                      }}
                    />
                  </AboutParagraph>
                </Tabs.Panel>
              </Modal.Body>
            </Tabs>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default AboutModal;
