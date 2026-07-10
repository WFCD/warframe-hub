'use client';

import { Fragment, useCallback, useState, type FC } from 'react';
import type { CodexItem } from '@/lib/shared';
import { wfcdn } from '@/lib/shared';
import ContentLinkButton from '@/components/pages/ContentPage/ContentLinkButton';
import { FishBoolIcon, FishExpandButton } from '@/components/pages/ContentPage/FishTableUi';
import { codexWikiUrl } from './codexWikiUrl';
import CodexItemDetailPanel from './CodexItemDetailPanel';

const COLUMN_COUNT = 7;

type CodexTableBodyProps = {
  rows: CodexItem[];
  currentPage: number;
  perPage: number;
  locale: string;
};

const CodexTableBody: FC<CodexTableBodyProps> = ({ rows, currentPage, perPage, locale }: CodexTableBodyProps) => {
  const pageRows = rows.slice((currentPage - 1) * perPage, currentPage * perPage);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleDetails = useCallback((key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <tbody>
      {pageRows.map((item) => {
        const rowKey = item.uniqueName || item.name;
        const isExpanded = expanded.has(rowKey);

        return (
          <Fragment key={rowKey}>
            <tr>
              <td className="hub-codex-table__expand">
                <FishExpandButton name={item.name} expanded={isExpanded} onToggle={() => toggleDetails(rowKey)} />
              </td>
              <td>
                <div className="hub-codex-table__name">
                  {item.imageName ? (
                    <img
                      className="hub-codex-table__thumb"
                      src={wfcdn(item.imageName)}
                      alt=""
                      width={32}
                      height={32}
                    />
                  ) : null}
                  <span>{item.name}</span>
                </div>
              </td>
              <td>{item.type ?? '—'}</td>
              <td>{item.category ?? '—'}</td>
              <td className="hub-codex-table__bool">
                <FishBoolIcon value={Boolean(item.tradable)} />
              </td>
              <td className="hub-codex-table__bool">
                <FishBoolIcon value={Boolean(item.masterable)} />
              </td>
              <td>
                <ContentLinkButton href={codexWikiUrl(item.name)} external size="sm">
                  Wiki <i className="fas fa-external-link-alt fa-xs" />
                </ContentLinkButton>
              </td>
            </tr>
            {isExpanded ? (
              <tr className="hub-codex-table__detail-row">
                <td colSpan={COLUMN_COUNT}>
                  <CodexItemDetailPanel uniqueName={item.uniqueName} locale={locale} enabled={isExpanded} />
                </td>
              </tr>
            ) : null}
          </Fragment>
        );
      })}
    </tbody>
  );
};

export default CodexTableBody;
