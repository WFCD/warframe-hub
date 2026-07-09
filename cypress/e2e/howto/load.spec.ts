describe('How to fish guide', () => {
  beforeEach(() => {
    cy.visitHub('/ow/fish/howto');
  });

  it('loads article layout and region tabs', () => {
    cy.contains('h1', 'How do Fish?').should('be.visible');
    cy.get('.hub-content-page--article').should('exist');
    cy.get('[aria-label="Fishing guide region"]').should('exist');
    cy.contains('[role="tab"]', 'Cetus').should('exist');
    cy.contains('[role="tab"]', 'Vallis').should('exist');
  });

  it('switches open world tabs', () => {
    cy.get('[aria-label="Fishing guide region"]').contains('[role="tab"]', 'Vallis').click();
    cy.contains('Shockprod fishing spear').should('be.visible');
    cy.contains('Lanzo fishing spear').should('not.exist');
    cy.get('[aria-label="Fishing guide region"]').contains('[role="tab"]', 'Cetus').click();
    cy.contains('Lanzo fishing spear').should('be.visible');
    cy.contains('Shockprod fishing spear').should('not.exist');
  });
});
