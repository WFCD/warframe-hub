import * as Sentry from '@sentry/nuxt';

/* Sentry Reporting */
const ignored = /(failed to fetch|EOF|host name|NotAllowedError)/gi;

Sentry.init({
  dsn: process.env.VUE_APP_DSN,
  beforeSend: (event, hint) => {
    const error = hint.originalException;
    // @ts-expect-error. TODO: Assert type of `error` to not be `unknown`.
    if ((error && error.message && !ignored.test(error.message)) || !error) {
      return event;
    }
    return null;
  },
});
