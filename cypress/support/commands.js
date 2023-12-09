Cypress.Commands.add('setupIntercepts', () => {
  cy.intercept('https://sentry.io/*', { log: false });
  cy.intercept(
    {
      url: 'https://www.warframe.com/repos/weeklyRivensPC.json',
      method: 'GET',
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
});
