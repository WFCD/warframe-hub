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

  publicPath: '/',
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: true,
  productionSourceMap: undefined,
  parallel: undefined,
  configureWebpack: {
    plugins: [],
  },
  css: {
    sourceMap: true,
    loaderOptions: {
      less: {
        modules: {
          rules: [
            { test: /\.css$/, use: [{ loader: 'css-loader' }] },
            {
              test: /\.less$/,
              use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' },
                {
                  loader: 'less-loader',
                },
              ],
            },
          ],
        },
      },
    },
  },
};
