const { startDevServer } = require('@cypress/webpack-dev-server');
const { getWebpackConfig } = require('nuxt');

module.exports = (on, config) => {
  on('dev-server:start', async (options) => {
    const webpackConfig = await getWebpackConfig();
    return startDevServer({
      options,
      webpackConfig,
    });
  });
};
