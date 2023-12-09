describe('Synthesis', () => {
  beforeEach(() => {
    cy.setupIntercepts();
    cy.visit(`http://localhost:3000/synthesis`);
    cy.wait(1000);
  });
  it('should load', () => {
    cy.get('input#filterInput').as('search');
    cy.get('@search').should('exist');
    cy.get('@search').siblings('.input-group-append').find('.btn').should('have.text', 'Clear');
  });
});
