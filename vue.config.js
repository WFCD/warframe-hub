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
};
