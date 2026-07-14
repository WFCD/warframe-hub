describe('Riven data', () => {
  beforeEach(() => {
    cy.fixture('rivens-cache').then((rivens) => {
      cy.visitHub('/riven/data', { cache: { rivens } });
    });
    cy.contains('h1', 'Riven Data').should('be.visible');
    cy.waitForHubTable(3);
  });

  it('loads filter toolbar and table rows', () => {
    cy.contains('button', 'Select Riven Types').should('exist');
    cy.contains('button', 'Filter by Rolled').should('exist');
    cy.get('.hub-native-table').should('exist');
    cy.get('.hub-native-table tbody tr').should('have.length', 3);
    cy.contains('Soma').should('be.visible');
  });

  it('filters by weapon search', () => {
    cy.get('#filterInput').should('be.visible').type('galatine');
    cy.get('.hub-native-table tbody tr').should('have.length', 1);
    cy.contains('Galatine').should('be.visible');
  });
});
