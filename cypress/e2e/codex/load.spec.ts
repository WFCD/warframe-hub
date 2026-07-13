describe('Codex', () => {
  beforeEach(() => {
    cy.setupIntercepts();
    cy.resetHubStorage();
    cy.intercept('GET', 'https://api.warframestat.us/items?only=*', {
      statusCode: 200,
      fixture: 'codex-items.json',
    }).as('items');
  });

  it('prefetches codex cache without error', () => {
    cy.visit('/codex');
    cy.wait('@items');
    cy.readCodexItemsCount('en').should('be.greaterThan', 0);
  });

  it('loads searchable item table under hubTest', () => {
    cy.fixture('codex-items').then((items) => {
      cy.visitHub('/codex', { cache: { items } });
    });
    cy.contains('h1', 'Item Codex').should('be.visible');
    cy.waitForHubTable(8);
    cy.get('#codex-filter').type('galatine');
    cy.location('search').should('include', 'q=galatine');
    cy.get('.hub-native-table tbody tr').should('have.length', 1);
    cy.contains('Galatine').should('be.visible');
    cy.get('.hub-navbar').should('exist');
    cy.location('pathname').should('eq', '/codex');
  });

  it('restores codex query from URL', () => {
    cy.fixture('codex-items').then((items) => {
      cy.visitHub('/codex?q=galatine', { cache: { items } });
    });
    cy.waitForHubTable(1);
    cy.get('#codex-filter').should('have.value', 'galatine');
    cy.get('.hub-native-table tbody tr').should('have.length', 1);
    cy.contains('Galatine').should('be.visible');
  });

  it('filters by item type', () => {
    cy.fixture('codex-items').then((items) => {
      cy.visitHub('/codex', { cache: { items } });
    });
    cy.waitForHubTable(8);
    cy.contains('button', 'Filter by Type').hubClick();
    cy.contains('.hub-content-type-filter .hub-switch', 'Warframe Mod').hubClick();
    cy.get('.hub-native-table tbody tr').should('have.length', 1);
    cy.contains('Vitality').should('be.visible');
  });

  it('loads expandable item details from API into IndexedDB', () => {
    cy.fixture('codex-items').then((items) => {
      cy.visitHub('/codex', { cache: { items } });
    });
    cy.waitForHubTable(8);
    cy.intercept('GET', 'https://api.warframestat.us/items/%2FLotus%2FPowersuits%2FExcalibur%2FExcalibur*', {
      fixture: 'codex-excalibur-detail.json',
    }).as('excaliburDetail');

    cy.get('#codex-filter').type('Excalibur');
    cy.get('.hub-content-expand-btn').first().hubClick();
    cy.wait('@excaliburDetail');
    cy.contains('.hub-codex-detail__description', 'warrior spirit').should('be.visible');
    cy.contains('.hub-codex-detail__heading', 'Abilities').should('be.visible');
    cy.contains('.hub-codex-detail__ability', 'Slash Dash').should('be.visible');
    cy.get('.hub-codex-detail__ability-icon').should('have.attr', 'src').and('include', 'Power04.png');
  });
});
