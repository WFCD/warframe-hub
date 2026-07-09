'use client';

import { useEffect, useState, type FC, type ReactNode } from 'react';
import { Button, Card } from '@heroui/react';
import { fetchItemByUniqueName, wfcdn } from '@wfcd/shared';

type CodexItem = {
  name: string;
  uniqueName?: string;
  imageName?: string;
  description?: string;
};

type CodexCardProps = {
  item: CodexItem;
  description?: string;
  link?: string;
  link2?: { a: string; title: string };
  children?: ReactNode;
};

const CodexCard: FC<CodexCardProps> = ({ item, description, link, link2, children }: CodexCardProps) => {
  const [imageName, setImageName] = useState(item.imageName ?? '');

  useEffect(() => {
    if (item.imageName) {
      setImageName(item.imageName);
      return;
    }

    if (!item.uniqueName) return;

    let cancelled = false;
    void fetchItemByUniqueName(item.uniqueName).then((data) => {
      if (!cancelled && data?.imageName) setImageName(data.imageName);
    });

    return () => {
      cancelled = true;
    };
  }, [item.imageName, item.uniqueName]);

  return (
    <Card className="hub-codex-card">
      <Card.Header className="hub-codex-card__header">{item.name}</Card.Header>
      <Card.Content className="hub-codex-card__content">
        {imageName ? (
          <img className="hub-codex-card__image" src={wfcdn(imageName)} alt={item.name} />
        ) : null}
        <p className="hub-codex-card__text">{children ?? description ?? item.description ?? ''}</p>
        <div className="hub-codex-card__actions">
          {link ? (
            <Button
              size="sm"
              variant="primary"
              className="hub-content-btn"
              onPress={() => window.open(link, '_blank', 'noopener,noreferrer')}
            >
              Wiki <i className="fas fa-link" />
            </Button>
          ) : null}
          {link2 ? (
            <Button
              size="sm"
              variant="primary"
              className="hub-content-btn"
              onPress={() => window.open(link2.a, '_blank', 'noopener,noreferrer')}
            >
              {link2.title} <i className="fas fa-link" />
            </Button>
          ) : null}
        </div>
      </Card.Content>
    </Card>
  );
};

export default CodexCard;
