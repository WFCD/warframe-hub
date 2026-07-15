/** Shared dev/preview port for vinext + Cypress + CI */
const devConfig = {
  port: 8742,
} as const;

export default devConfig;
export type DevConfig = typeof devConfig;
