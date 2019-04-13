module.exports = {
  plugins: [
    require('postcss-preset-env')({ stage: 0 }),
    require('tailwindcss')('./tailwind.config.js'),
    // IN_PRODUCTION &&
    //    require('@fullhuman/postcss-purgecss')({
    //      content: [
    //        `./@(public|src)/**/*.@(${extensionsUsingCSS.join('|')})`,
    //        './@(src/assets/styles/components)/*.css',
    //        './@(src/assets/styles/themes)/*.@(${extensionsOfCSS.join(' | ')})'
    //      ],
    //      css: [`./src/**/*.@(${extensionsOfCSS.join('|')})`],
    //      extractors: [
    //        {
    //          extractor: TailwindVueExtractor,
    //          extensions: extensionsUsingCSS
    //        }
    //      ],
    //      whitelist: [],
    //      whitelistPatterns: [
    //        /-(leave|enter|appear)(|-(to|from|active))$/,
    //        /^(?!(|.*?:)cursor-move).+-move$/,
    //        /^router-link(|-exact)-active$/,
    //        /^theme-$/,
    //        /^card-$/
    //      ]
    //  }),*/
    require('autoprefixer')()
  ]
};
