describe('Timers', () => {
  beforeEach(() => {
    cy.setupIntercepts();
    cy.seedHub({
      fixture: 'timers-full',
      platform: 'pc',
      // Off by default in components.json — enable via prefs localStorage
      enablePanels: ['deals', 'conclave'],
    });
  });

  describe('Cycle dock', () => {
    it('renders cycle timer pills', () => {
      cy.get('.hub-cycle-timers').should('exist');
      cy.get('.hub-cycle-timer-pill').should('have.length.at.least', 3);
    });
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

  describe('Core masonry panels', () => {
    it('renders construction, baro, news, invasions, darvo, sales, conclave, alerts', () => {
      cy.get('div.construction').should('exist');
      cy.get('div.baro').should('exist');
      cy.get('div.news').should('exist');
      cy.get('div.invasions').should('exist');
      cy.get('div.darvo').should('exist');
      cy.get('div.sales').should('exist');
      cy.get('div.conclave').should('exist');
      cy.contains('.hub-panel-title', 'Alerts').should('exist');
    });
  });

  describe('Offline banner', () => {
    it('shows cached banner when offline', () => {
      cy.visit('/?hubTest=1&fixture=timers-full');
      cy.window().then((win) => {
        // Cypress 15: 3-arg stub(object, method, fn) removed — use callsFake / value
        cy.stub(win.navigator, 'onLine').value(false);
        win.dispatchEvent(new Event('offline'));
      });
      cy.contains('Showing cached data').should('be.visible');
    });
  });
});
