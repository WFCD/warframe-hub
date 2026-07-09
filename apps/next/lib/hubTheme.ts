const LIGHT_HUB_THEMES = new Set(['day']);

export const isLightHubTheme = (hubTheme: string): boolean => LIGHT_HUB_THEMES.has(hubTheme);

export const heroUiThemeForHub = (hubTheme: string): 'light' | 'dark' =>
  isLightHubTheme(hubTheme) ? 'light' : 'dark';
