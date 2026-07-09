describe('Timers', () => {
  beforeEach(() => {
    cy.setupIntercepts();
    cy.seedHub({ fixture: 'timers-full', platform: 'pc' });
  });

  describe('Fissures', () => {
    it('should load all three fissure panels', () => {
      cy.get('div.fissures').should('exist');
      cy.get('div.void-storms').should('exist');
      cy.get('div.steel-path-fissures').should('exist');
      cy.get('div.fissures .hub-panel-row').should('have.length.at.least', 1);
    });
  });

  describe('Nightwave', () => {
    it('should load', () => {
      cy.get('div.nightwave').should('exist');
    });
  });

  describe('Sortie', () => {
    it('should load', () => {
      cy.get('div.sortie').should('exist');
    });
  });

  describe('Bounties', () => {
    it('should load', () => {
      cy.get('div.bounties').should('have.length.at.least', 1);
    });
  });

  describe('Offline banner', () => {
    it('shows cached banner when offline', () => {
      cy.visit('/?hubTest=1&fixture=timers-full');
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(false);
        win.dispatchEvent(new Event('offline'));
      });
      cy.contains('Showing cached data').should('be.visible');
    });
  });
});
