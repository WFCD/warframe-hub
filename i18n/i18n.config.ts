import locales from '../static/json/locales.json';

/*
  Vite provides a way to dynamically import files from a directory,
  however it is noted that this does not work when Vite is used for Server-Side Rendering.
  (Read more: https://vite.dev/guide/assets#new-url-url-import-meta-url)

  It is unclear whether this caveat also disqualifies Nuxt in SPA mode.
*/
import cs from '../static/lang/cs.json';
import de from '../static/lang/de.json';
import en from '../static/lang/en.json';
import es from '../static/lang/es.json';
import fr from '../static/lang/fr.json';
import it from '../static/lang/it.json';
import ko from '../static/lang/ko.json';
import pl from '../static/lang/pl.json';
import pt from '../static/lang/pt.json';
import ru from '../static/lang/ru.json';
import sr from '../static/lang/sr.json';
import tr from '../static/lang/tr.json';
import zh from '../static/lang/zh.json';

const messages: Record<string, unknown> = { cs, de, en, es, fr, it, ko, pl, pt, ru, sr, tr, zh }; // TODO: Give this a better type

export default () => {
  return {
    // vue-i18n options
    fallbackLocale: 'en',
    messages,
  };
};
