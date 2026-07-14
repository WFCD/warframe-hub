'use client';

import type { FC } from 'react';
import { parseWarframeRichText } from '@/lib/shared/warframeTextIcons';
import './WarframeRichText.scss';

type WarframeRichTextProps = {
  text: string;
  className?: string;
};

const WarframeRichText: FC<WarframeRichTextProps> = ({ text, className }: WarframeRichTextProps) => {
  const value = typeof text === 'string' ? text : '';
  if (!value) return null;

  return (
    <span className={['hub-wf-rich-text', className].filter(Boolean).join(' ')}>{parseWarframeRichText(value)}</span>
  );
};

export default WarframeRichText;
