describe('Synthesis', () => {
  beforeEach(() => {
    cy.fixture('synth-targets').then((synth) => {
      cy.visitHub('/synthesis', { cache: { synth } });
    });
    cy.contains('h1', 'Synthesis Targets').should('be.visible');
    cy.waitForHubTable(7);
  });

  it('loads search toolbar and table', () => {
    cy.get('.hub-native-table tbody tr').should('have.length', 7);
    cy.get('#synth-filter').should('be.visible').clear().type('Ballista');
    cy.get('button[aria-label="Clear search"]').should('be.visible');
  });

  it('filters rows by search', () => {
    cy.get('#synth-filter').should('be.visible').clear().type('Ballista');
    cy.get('.hub-native-table tbody tr').should('have.length', 1);
    cy.contains('Ballista').should('be.visible');
    cy.contains('Ancient Disruptor').should('not.exist');
  });

  it('paginates without runtime errors', () => {
    cy.get('nav[aria-label="Pagination"] button[aria-label="Page 2"]').hubClick();
    cy.contains('Crawler').should('be.visible');
    cy.contains('Ancient Disruptor').should('not.exist');
    cy.get('body').should('not.contain', 'There was an error during concurrent rendering');
  });
});
