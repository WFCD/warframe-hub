export const codexWikiUrl = (name: string): string =>
  `https://wiki.warframe.com/w/${encodeURIComponent(name.replace(/ /g, '_'))}`;
