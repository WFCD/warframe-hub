const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const { version } = require('./package.json');

module.exports = {
  pwa: {
    name: 'Warframe Hub',
    themeColor: '#1a5072',
    msTileColor: '#1a5072',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },
  runtimeCompiler: true,
  css: {
    sourceMap: true,
    loaderOptions: {
      less: {
        modules: {
          rules: [
            {
              test: /\.css$/,
              use: [
                {
                  loader: 'style-loader',
                },
                {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                  },
                },
              ],
            },
            {
              test: /\.less$/,
              use: [
                {
                  loader: 'style-loader',
                },
                {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                  },
                },
                {
                  loader: 'less-loader',
                  options: {
                    lessOptions: {
                      strictMath: true,
                      noIeCompat: true,
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    },
    requireModuleExtension: true,
  },
  lintOnSave: true,
  configureWebpack: (config) => {
    config.devtool = 'source-map';
    if (process.env.SENTRY_AUTH_TOKEN) {
      if (!config.plugins || !config.plugins.length) {
        config.plugins = [
          new SentryWebpackPlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            release: `${process.env.SENTRY_PROJECT}@${version}`,
            include: './dist',
            ignore: ['node_modules', 'vue.config.js'],
          }),
        ];
      }
    }
  },
};
