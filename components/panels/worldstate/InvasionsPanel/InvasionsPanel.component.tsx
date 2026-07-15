'use client';

import { useMemo, type FC } from 'react';
import { Disclosure } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import type { ComponentConfig } from '@/lib/shared';
import { usePrefs } from '@/lib/providers/PrefsProvider';
import NoDataItem from '@/components/ui/NoDataItem';
import HubPanelWrap from '@/components/panels/shared/HubPanelWrap';
import InvasionItem, { type Invasion } from '@/components/panels/shared/InvasionItem';

type InvasionsPanelProps = {
  invasions?: Invasion[];
};

const MAX_INVASIONS = 5;

const InvasionList: FC<{ invasions: Invasion[] }> = ({ invasions }: { invasions: Invasion[] }) => (
  <div className='hub-invasion-list'>
    {invasions.map((invasion) => (
      <InvasionItem key={invasion.id} invasion={invasion} />
    ))}
  </div>
);

const InvasionsPanel: FC<InvasionsPanelProps> = ({ invasions = [] }: InvasionsPanelProps) => {
  const { t } = useTranslation();
  const { state, dispatch } = usePrefs();
  const headertext = t('invasions.header');

  const invasionsConfig = state.components.invasions as ComponentConfig & { expand?: boolean };
  const expanded = invasionsConfig?.expand ?? false;

  const ongoing = useMemo(() => invasions.filter((i) => !i.completed), [invasions]);
  const current = ongoing.slice(0, MAX_INVASIONS);
  const overflow = ongoing.slice(MAX_INVASIONS);

  const setExpanded = (isExpanded: boolean) => {
    dispatch({
      type: 'SET_COMPONENT',
      payload: ['invasions', { ...invasionsConfig, expand: isExpanded }],
    });
  };

  return (
    <HubPanelWrap title={headertext} className={`invasions ${!invasions.length ? 'no-content' : ''}`}>
      {current.length > 0 ? (
        <>
          <InvasionList invasions={current} />
          {overflow.length > 0 && (
            <Disclosure className='hub-invasion-more' isExpanded={expanded} onExpandedChange={setExpanded}>
              <Disclosure.Trigger className='hub-invasion-more-trigger'>
                {t('invasions.showMore', { count: overflow.length })}
                <Disclosure.Indicator />
              </Disclosure.Trigger>
              <Disclosure.Content>
                <Disclosure.Body>
                  <InvasionList invasions={overflow} />
                </Disclosure.Body>
              </Disclosure.Content>
            </Disclosure>
          )}
        </>
      ) : (
        <NoDataItem text={headertext} />
      )}
    </HubPanelWrap>
  );
};

export default InvasionsPanel;
