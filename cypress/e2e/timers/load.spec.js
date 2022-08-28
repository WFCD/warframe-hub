describe('Timers', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.wait(1000);
  });
  describe('Fissures', () => {
    it('should load', () => {
      const fissures = cy.get('div.fissures');
      fissures.children().should('have.length', 2);
    });
  });
  describe('Nightwave', () => {
    it('should load', () => {
      const nightwave = cy.get('div.nightwave');
      nightwave.children().should('have.length', 2);
    });
  });
  describe('Sortie', () => {
    it('should load', () => {
      const sortie = cy.get('div.sortie');
      sortie.children().should('have.length', 2);
    });
  });
  describe('Bounties', () => {
    it('should load', () => {
      const bounties = cy.get('div.bounties');
      bounties.should('have.length', 3);
      bounties.each((bountyPanel) => {
        expect(bountyPanel.children()).to.have.length(2);
      });
    });
  });
});
