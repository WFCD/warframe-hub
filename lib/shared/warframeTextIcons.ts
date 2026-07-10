import { createElement, type ReactNode } from 'react';

export const GENESIS_EMOJI_BASE = 'https://wfcd.github.io/genesis-assets/emoji';

/** Mirrors genesis `dtEmojiForTag` aliases in packages/shared/utilities/CommonFunctions.ts */
const DT_ALIASES: Record<string, string> = {
  IMPACT: 'impact',
  IMPACT_COLOR: 'impact',
  PUNCTURE: 'puncture',
  PUNCTURE_COLOR: 'puncture',
  SLASH: 'slash',
  SLASH_COLOR: 'slash',
  FIRE: 'heat',
  FIRE_COLOR: 'heat',
  FREEZE: 'cold',
  FREEZE_COLOR: 'cold',
  POISON: 'toxin',
  POISON_COLOR: 'toxin',
  ELECTRICITY: 'electricity',
  ELECTRICITY_COLOR: 'electricity',
  MAGNETIC: 'magnetic',
  MAGNETIC_COLOR: 'magnetic',
  RADIATION: 'radiation',
  RADIATION_COLOR: 'radiation',
  RADIANT_COLOR: 'radiation',
  CORROSIVE: 'corrosive',
  CORROSIVE_COLOR: 'corrosive',
  VIRAL: 'viral',
  VIRAL_COLOR: 'viral',
  GAS: 'gas',
  GAS_COLOR: 'gas',
  EXPLOSION: 'blast',
  EXPLOSION_COLOR: 'blast',
  SENTIENT: 'void',
};

const VALID_DT_KEYS = new Set([
  'blast',
  'cold',
  'corrosive',
  'electricity',
  'gas',
  'heat',
  'impact',
  'magnetic',
  'puncture',
  'radiation',
  'slash',
  'toxin',
  'viral',
  'void',
]);

const TOKEN_RE = /<DT_([A-Z0-9_]+)>|\|([A-Z0-9_]+)\|/gi;

export const dtAssetKey = (tag: string): string | null => {
  const upper = tag.toUpperCase();
  const aliased = DT_ALIASES[upper];
  if (aliased) return aliased;

  const normalized = upper
    .replace(/_COLOR_NO_ADV$/, '')
    .replace(/_NO_ADV$/, '')
    .replace(/_OUTLINE$/, '')
    .replace(/_COLOR$/, '');
  const fromNormalized = DT_ALIASES[normalized] ?? normalized.toLowerCase();
  return VALID_DT_KEYS.has(fromNormalized) ? fromNormalized : null;
};

export const genesisDtIconUrl = (tag: string): string | null => {
  const key = dtAssetKey(tag);
  return key ? `${GENESIS_EMOJI_BASE}/${key}.png` : null;
};

const renderDtIcon = (tag: string, key: string): ReactNode => {
  const iconUrl = genesisDtIconUrl(tag);
  if (!iconUrl) return `<DT_${tag}>`;

  return createElement('img', {
    key,
    src: iconUrl,
    alt: dtAssetKey(tag) ?? tag,
    className: 'hub-wf-dt-icon',
    width: 16,
    height: 16,
    loading: 'lazy',
    decoding: 'async',
  });
};

const renderVarToken = (name: string, key: string): ReactNode =>
  createElement('span', { key, className: 'hub-wf-var', title: name }, name);

export const parseWarframeRichText = (text: string): ReactNode[] => {
  if (!text) return [];

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let tokenIndex = 0;

  for (const match of text.matchAll(TOKEN_RE)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index));
    }

    if (match[1]) {
      parts.push(renderDtIcon(match[1], `dt-${tokenIndex}`));
    } else if (match[2]) {
      parts.push(renderVarToken(match[2], `var-${tokenIndex}`));
    }

    tokenIndex += 1;
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : [text];
};
