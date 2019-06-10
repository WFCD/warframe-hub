/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  theme: {
    extend: {
      width: {
        time: '34.33333%'
      },
      textColor: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        default: 'var(--color-text-default)',
        'default-soft': 'var(--color-text-default-soft)',
        inverse: 'var(--color-text-inverse)',
        'inverse-soft': 'var(--color-text-inverse-soft)',
        navbarbrand: 'var(--color-text-navbarbrand)'
      },
      backgroundColor: {
        newsbox: 'var(--color-bg-newsbox)',
        navbar: 'var(--color-bg-navbar)',
        box: 'var(--color-bg-box)',
        boxaccent: 'var(--color-bg-boxaccent)',
        primary: 'var(--color-bg-primary)',
        secondary: 'var(--color-bg-secondary)',
        default: 'var(--color-bg-default)',
        inverse: 'var(--color-bg-inverse)',
        tooltipbtn: 'var(--color-bg-tooltipbtn)'
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)'
      },
      fontWeights: {
        normal: 'var(--font-weight-normal)',
        display: 'var(--font-weight-display)',
        btn: 'var(--font-weight-btn)'
      },
      borderRadius: {
        none: '0',
        btn: 'var(--rounded-btn)'
      },
      borderColor: {
        box: 'var(--color-border-box)'
      }
    }
  },
  variants: {},
  plugins: []
}
