import 'cypress-real-events/support';
import './commands';
import { dismissVinextDevOverlay } from '../../lib/test/dismissVinextDevOverlay';

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Hydration failed')) return false;
  if (err.message.includes('hydration')) return false;
  if (err.message.includes('concurrent rendering')) return false;
});

// Vinext leaves a fixed dev overlay after hydration errors; strip it during e2e.
Cypress.on('window:before:load', (win) => {
  win.addEventListener('DOMContentLoaded', () => {
    dismissVinextDevOverlay(win.document);
    const observer = new MutationObserver(() => dismissVinextDevOverlay(win.document));
    observer.observe(win.document.documentElement, { childList: true, subtree: true });
  });
});
