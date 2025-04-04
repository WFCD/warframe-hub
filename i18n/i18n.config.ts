import locales from '../static/json/locales.json';

const messages: Record<string, unknown> = {}; // TODO: Give this a better type
Object.keys(locales).forEach(async (locale) => {
  messages[locale] = await import(`./static/lang/${locale}.json`);
});

export default () => {
  return {
    // vue-i18n options
    fallbackLocale: 'en',
    messages,
  };
};
