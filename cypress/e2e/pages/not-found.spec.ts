describe('Not found', () => {
  it('renders 404 page with home link', () => {
    cy.visitHub('/this-route-does-not-exist', { failOnStatusCode: false });
    cy.contains('h1', '404 ERROR OH NO').should('be.visible');
    cy.contains('a', 'Click here to return to a safe place').should('have.attr', 'href', '/');
  });
});
