describe('Synthesis', () => {
  beforeEach(() => {
    cy.visit(`http://localhost:3000/synthesis`);
    cy.wait(1000);
  });
  it('should load', () => {
    const searchBox = cy.get('input#filterInput');
    searchBox.should('exist');
    searchBox.siblings('.input-group-append').find('.btn').should('have.text', 'Clear');
  });
});
