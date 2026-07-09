describe('Codex prefetch', () => {
  beforeEach(() => {
    cy.setupIntercepts();
    cy.resetHubStorage();
    cy.intercept('GET', 'https://api.warframestat.us/warframes*', {
      statusCode: 200,
      body: [{ name: 'Excalibur' }],
    }).as('warframes');
    cy.intercept('GET', 'https://api.warframestat.us/weapons*', { statusCode: 200, body: [{ name: 'Braton' }] }).as(
      'weapons'
    );
    cy.intercept('GET', 'https://api.warframestat.us/mods*', { statusCode: 200, body: [{ name: 'Vitality' }] }).as(
      'mods'
    );
    cy.visit('/codex');
  });

  it('prefetches codex cache without error', () => {
    cy.wait(['@warframes', '@weapons', '@mods']);
    cy.window().then((win) => {
      expect(win.localStorage.getItem('hub.v1.cache.codex.warframes')).to.not.be.null;
      expect(win.localStorage.getItem('hub.v1.cache.codex.weapons')).to.not.be.null;
      expect(win.localStorage.getItem('hub.v1.cache.codex.mods')).to.not.be.null;
    });
  });
});
