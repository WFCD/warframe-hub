import { startDevServer } from '@cypress/webpack-dev-server';
import { getWebpackConfig } from 'nuxt';

export default (on) => {
  on('dev-server:start', async (options) => {
    const webpackConfig = await getWebpackConfig();
    return startDevServer({
      options,
      webpackConfig,
    });
  });
};
