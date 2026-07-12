import 'cypress-real-events/support';
import './commands';

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Hydration failed')) return false;
  if (err.message.includes('concurrent rendering')) return false;
});
