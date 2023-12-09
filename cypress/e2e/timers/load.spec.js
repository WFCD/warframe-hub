describe('Timers', () => {
  beforeEach(() => {
    cy.setupIntercepts();
    cy.intercept('https://api.warframestat.us/pc/?language=en').as('wsRequest');
    cy.visit('http://localhost:3000/');
    cy.wait('@wsRequest');
  });
  describe('Fissures', () => {
    let fissures;
    it('should load', () => {
      cy.get('div.fissures').as('fissures');
      cy.get('@fissures').children().should('have.length', 2);

      cy.get('div.fissures .list-group-item.list-group-item-borderbottom').as('fissureSelection');
      cy.get('@fissureSelection').find('.btn.btn-outline-primary.btn-sm').as('selectionButtons');

      cy.get('@selectionButtons').should('have.length', 4);
      cy.get('@selectionButtons').eq(0).should('have.text', 'Fissures');
      cy.get('@selectionButtons').eq(1).should('have.text', 'Void Storm');
      cy.get('@selectionButtons').eq(2).should('have.text', 'Steel Path');
      cy.get('@selectionButtons').eq(3).should('have.text', 'All');

      cy.get('div.fissures>.list-group>.list-group-item.list-group-item-borderless.pb-0').then(($el) => {
        fissures = Cypress.dom.wrap($el);
        cy.get('@fissures')
          .find('.list-group .list-group-item')
          .should('have.length', fissures.length + 2);
      });
    });
    it('should filter Steel Path', () => {
      cy.get('div.fissures .list-group .list-group-item').as('fissures');
      cy.get('div.fissures .list-group-item.list-group-item-borderbottom').as('fissureSelection');
      cy.get('@fissureSelection').find('.btn.btn-outline-primary.btn-sm').as('selectionButtons');
      cy.get('@selectionButtons').eq(2).click();

      cy.get('div.fissures>.list-group>.list-group-item.list-group-item-borderless.pb-0').then(($el) => {
        const steelFissures = Cypress.dom.wrap($el);
        cy.get('@fissures')
          .should('have.length', steelFissures.length + 2)
          .and('have.length.lessThan', fissures.length);
      });
    });
    it('should filter Void Storms', () => {
      cy.get('div.fissures .list-group .list-group-item').as('fissures');
      cy.get('div.fissures .list-group-item.list-group-item-borderbottom').as('fissureSelection');
      cy.get('@fissureSelection').find('.btn.btn-outline-primary.btn-sm').as('selectionButtons');
      cy.get('@selectionButtons').eq(2).click();

      cy.get('div.fissures>.list-group>.list-group-item.list-group-item-borderless.pb-0').then(($el) => {
        const stormFissures = Cypress.dom.wrap($el);
        cy.get('@fissures')
          .should('have.length', stormFissures.length + 2)
          .and('have.length.lessThan', fissures.length);
      });
    });
    it('should show icons for specialty types', () => {
      cy.get('div.fissures .list-group .list-group-item.pb-0').as('fissures');
      cy.get('div.fissures .list-group-item.list-group-item-borderbottom').as('fissureSelection');
      cy.get('@fissureSelection').find('.btn.btn-outline-primary.btn-sm').as('selectionButtons');

      // select Void Fissures
      cy.get('@selectionButtons').eq(1).click();
      cy.get('@fissures').each(($fissureRow) => {
        cy.wrap($fissureRow)
          .find('.li-mission-decorator.li-mission-decorator-lg')
          .each(($img, idx) => {
            if (idx === 1) cy.wrap($img).should('have.attr', 'title', 'Void Storm');
          });
      });

      // select Steel Path
      cy.get('@selectionButtons').eq(2).click();
      cy.get('@fissures').each(($fissureRow) => {
        cy.wrap($fissureRow)
          .find('.li-mission-decorator.li-mission-decorator-lg')
          .each(($img, idx) => {
            if (idx === 1) cy.wrap($img).should('have.attr', 'title', 'Steel Path');
          });
      });
    });
  });
  describe('Nightwave', () => {
    it('should load', () => {
      cy.get('div.nightwave').as('nightwave');
      cy.get('@nightwave').children().should('have.length', 2);
    });
  });
  describe('Sortie', () => {
    it('should load', () => {
      cy.get('div.sortie').as('sortie');
      // 2 for archons, 2 for sortie
      cy.get('@sortie').children().should('have.length', 4);
    });
  });
  describe('Bounties', () => {
    it('should load', () => {
      cy.get('div.bounties').as('bounties');
      cy.get('@bounties').should('have.length', 3);
      cy.get('@bounties').each((bountyPanel) => {
        expect(bountyPanel.children()).to.have.length(2);
      });
    });
  });
});
