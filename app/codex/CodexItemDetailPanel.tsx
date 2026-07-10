'use client';

import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { CodexItemDetail } from '@/lib/shared';
import { wfcdn } from '@/lib/shared';
import ContentLinkButton from '@/components/pages/ContentPage/ContentLinkButton';
import WarframeRichText from '@/components/media/WarframeRichText/WarframeRichText';
import { useCodexItemDetail } from '@/lib/hooks/useCodexItemDetail';

const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (!days && mins) parts.push(`${mins}m`);
  return parts.join(' ') || `${seconds}s`;
};

const formatCredits = (value: number): string => value.toLocaleString();

const formatChance = (chance: number): string => `${(chance * 100).toFixed(2)}%`;

type DetailFieldProps = {
  label: string;
  value: ReactNode;
};

const DetailField: FC<DetailFieldProps> = ({ label, value }: DetailFieldProps) => (
  <div className="hub-codex-detail__field">
    <dt className="hub-codex-detail__label">{label}</dt>
    <dd className="hub-codex-detail__value">{value}</dd>
  </div>
);

type CodexItemDetailContentProps = {
  detail: CodexItemDetail;
};

const CodexItemDetailContent: FC<CodexItemDetailContentProps> = ({ detail }: CodexItemDetailContentProps) => {
  const { t } = useTranslation();
  const maxModRank = detail.levelStats?.length ? detail.levelStats.length - 1 : null;
  const maxModStats = maxModRank !== null ? detail.levelStats?.[maxModRank]?.stats : null;

  return (
    <div className="hub-codex-detail">
      {detail.description ? (
        <p className="hub-codex-detail__description">
          <WarframeRichText text={detail.description} />
        </p>
      ) : null}

      <dl className="hub-codex-detail__grid">
        {detail.masteryReq != null ? (
          <DetailField label={t('codex.detail.mastery')} value={detail.masteryReq} />
        ) : null}
        {detail.isPrime != null ? (
          <DetailField label={t('codex.detail.prime')} value={detail.isPrime ? t('codex.detail.yes') : t('codex.detail.no')} />
        ) : null}
        {detail.polarity ? <DetailField label={t('codex.detail.polarity')} value={detail.polarity} /> : null}
        {detail.polarities?.length ? (
          <DetailField label={t('codex.detail.polarities')} value={detail.polarities.join(', ')} />
        ) : null}
        {detail.rarity ? <DetailField label={t('codex.detail.rarity')} value={detail.rarity} /> : null}
        {detail.compatName ? <DetailField label={t('codex.detail.compat')} value={detail.compatName} /> : null}
        {detail.baseDrain != null ? <DetailField label={t('codex.detail.drain')} value={detail.baseDrain} /> : null}
        {detail.fusionLimit != null ? <DetailField label={t('codex.detail.fusion')} value={detail.fusionLimit} /> : null}
        {detail.health != null ? <DetailField label={t('codex.detail.health')} value={detail.health} /> : null}
        {detail.shield != null ? <DetailField label={t('codex.detail.shield')} value={detail.shield} /> : null}
        {detail.armor != null ? <DetailField label={t('codex.detail.armor')} value={detail.armor} /> : null}
        {detail.power != null ? <DetailField label={t('codex.detail.power')} value={detail.power} /> : null}
        {detail.stamina != null ? <DetailField label={t('codex.detail.stamina')} value={detail.stamina} /> : null}
        {detail.sprintSpeed != null ? (
          <DetailField label={t('codex.detail.sprint')} value={detail.sprintSpeed} />
        ) : null}
        {detail.buildPrice != null ? (
          <DetailField label={t('codex.detail.buildPrice')} value={formatCredits(detail.buildPrice)} />
        ) : null}
        {detail.buildTime != null ? (
          <DetailField label={t('codex.detail.buildTime')} value={formatDuration(detail.buildTime)} />
        ) : null}
        {detail.buildQuantity != null ? (
          <DetailField label={t('codex.detail.buildQuantity')} value={detail.buildQuantity} />
        ) : null}
        {detail.introduced?.name ? (
          <DetailField label={t('codex.detail.introduced')} value={detail.introduced.name} />
        ) : null}
      </dl>

      {detail.passiveDescription ? (
        <p className="hub-codex-detail__passive">
          <strong>{t('codex.detail.passive')}:</strong> <WarframeRichText text={detail.passiveDescription} />
        </p>
      ) : null}

      {maxModStats?.length ? (
        <section className="hub-codex-detail__section">
          <h3 className="hub-codex-detail__heading">
            {t('codex.detail.maxRank', { rank: maxModRank })}
          </h3>
          <ul className="hub-codex-detail__list">
            {maxModStats.map((stat) => (
              <li key={stat}>
                <WarframeRichText text={stat} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {detail.abilities?.length ? (
        <section className="hub-codex-detail__section">
          <h3 className="hub-codex-detail__heading">{t('codex.detail.abilities')}</h3>
          <ul className="hub-codex-detail__abilities">
            {detail.abilities.map((ability) => (
              <li key={ability.uniqueName} className="hub-codex-detail__ability">
                {ability.imageName ? (
                  <img
                    className="hub-codex-detail__ability-icon"
                    src={wfcdn(ability.imageName)}
                    alt=""
                    width={32}
                    height={32}
                  />
                ) : null}
                <div>
                  <strong>{ability.name}</strong>
                  {ability.description ? (
                    <p>
                      <WarframeRichText text={ability.description} />
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {detail.components?.length ? (
        <section className="hub-codex-detail__section">
          <h3 className="hub-codex-detail__heading">{t('codex.detail.components')}</h3>
          <table className="hub-codex-detail__table">
            <thead>
              <tr>
                <th scope="col">{t('codex.detail.componentName')}</th>
                <th scope="col">{t('codex.detail.componentCount')}</th>
              </tr>
            </thead>
            <tbody>
              {detail.components.map((component) => (
                <tr key={component.uniqueName}>
                  <td>
                    <div className="hub-codex-detail__component">
                      {component.imageName ? (
                        <img
                          className="hub-codex-detail__component-icon"
                          src={wfcdn(component.imageName)}
                          alt=""
                          width={24}
                          height={24}
                        />
                      ) : null}
                      <span>{component.name}</span>
                    </div>
                  </td>
                  <td>{component.itemCount ?? 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {detail.drops?.length ? (
        <section className="hub-codex-detail__section">
          <h3 className="hub-codex-detail__heading">{t('codex.detail.drops')}</h3>
          <table className="hub-codex-detail__table">
            <thead>
              <tr>
                <th scope="col">{t('codex.detail.dropLocation')}</th>
                <th scope="col">{t('codex.detail.dropType')}</th>
                <th scope="col">{t('codex.detail.dropChance')}</th>
              </tr>
            </thead>
            <tbody>
              {detail.drops.map((drop, index) => (
                <tr key={`${drop.location}-${drop.type}-${index}`}>
                  <td>{drop.location ?? '—'}</td>
                  <td>{drop.type ?? '—'}</td>
                  <td>{drop.chance != null ? formatChance(drop.chance) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {detail.wikiaUrl ? (
        <div className="hub-codex-detail__links">
          <ContentLinkButton href={detail.wikiaUrl} external size="sm">
            {t('codex.detail.wiki')} <i className="fas fa-external-link-alt fa-xs" />
          </ContentLinkButton>
        </div>
      ) : null}
    </div>
  );
};

type CodexItemDetailPanelProps = {
  uniqueName: string;
  locale: string;
  enabled: boolean;
};

const CodexItemDetailPanel: FC<CodexItemDetailPanelProps> = ({
  uniqueName,
  locale,
  enabled,
}: CodexItemDetailPanelProps) => {
  const { t } = useTranslation();
  const { detail, status } = useCodexItemDetail(uniqueName, locale, enabled);

  if (status === 'loading' || status === 'idle') {
    return <p className="hub-codex-detail__status">{t('codex.detail.loading')}</p>;
  }

  if (status === 'error' || !detail) {
    return <p className="hub-codex-detail__status hub-codex-detail__status--error">{t('codex.detail.error')}</p>;
  }

  return <CodexItemDetailContent detail={detail} />;
};

export default CodexItemDetailPanel;
