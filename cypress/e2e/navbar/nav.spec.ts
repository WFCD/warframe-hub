describe('Navbar', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visitHub('/');
  });

  it('shows brand and left nav destinations', () => {
    cy.get('.hub-navbar-brand').should('be.visible').and('have.attr', 'href', '/');
    cy.get('.hub-navbar-start').within(() => {
      cy.get('a[aria-label="Timers"]').should('exist');
      cy.get('button[aria-label="Open World"]').should('exist');
      cy.get('a[aria-label="Riven Data"]').should('exist');
      cy.get('a[aria-label="Synthesis Targets"]').should('exist');
      cy.get('a[aria-label="Item Codex"]').should('exist');
      cy.get('button[aria-label="Projects"]').should('exist');
    });
  });

  it('navigates to riven and synthesis from top-level links', () => {
    cy.get('.hub-navbar-start a[aria-label="Riven Data"]').click();
    cy.location('pathname').should('eq', '/riven/data');
    cy.contains('h1', 'Riven Data').should('be.visible');

    cy.get('.hub-navbar-start a[aria-label="Synthesis Targets"]').click();
    cy.location('pathname').should('eq', '/synthesis');
    cy.contains('h1', 'Synthesis Targets').should('be.visible');

    cy.get('.hub-navbar-start a[aria-label="Item Codex"]').click();
    cy.location('pathname').should('eq', '/codex');
    cy.contains('h1', 'Item Codex').should('be.visible');
  });

  it('opens open-world map from dropdown', () => {
    cy.get('.hub-navbar-start button[aria-label="Open World"]').click();
    cy.get('.hub-nav-popover a[href="/poe/map"]').click();
    cy.location('pathname').should('eq', '/poe/map');
    cy.get('.leaflet-container', { timeout: 10000 }).should('exist');
  });

  it('marks timers active on home and riven active on riven page', () => {
    cy.get('.hub-navbar-start a[aria-label="Timers"]').should('have.attr', 'aria-current', 'page');
    cy.get('.hub-navbar-start a[aria-label="Riven Data"]').click();
    cy.get('.hub-navbar-start a[aria-label="Riven Data"]').should('have.attr', 'aria-current', 'page');
    cy.get('.hub-navbar-start a[aria-label="Timers"]').should('not.have.attr', 'aria-current');
  });
});

describe('Navbar mobile', () => {
  beforeEach(() => {
    cy.viewport(390, 844);
    cy.visitHub('/');
  });

  it('shows brand label, projects, and support items in header', () => {
    cy.get('.hub-navbar-brand').should('be.visible').and('contain', 'Warframe Hub');
    cy.get('.hub-navbar-end--header').within(() => {
      cy.get('button[aria-label="Projects"]').should('be.visible');
      cy.get('a[aria-label="Discord"]').should('be.visible');
      cy.get('button[aria-label="Information"]').should('be.visible');
      cy.get('button[aria-label="Settings"]').should('be.visible');
    });
  });

  it('shows main destinations in bottom nav', () => {
    cy.get('.hub-bottom-nav').should('be.visible').within(() => {
      cy.get('a[aria-label="Timers"]').should('be.visible');
      cy.get('button[aria-label="Open World"]').should('be.visible');
      cy.get('a[aria-label="Riven Data"]').should('be.visible');
      cy.get('a[aria-label="Synthesis Targets"]').should('be.visible');
      cy.get('a[aria-label="Item Codex"]').should('be.visible');
      cy.get('button[aria-label="Projects"]').should('not.exist');
    });
  });

  it('navigates from bottom nav', () => {
    cy.get('.hub-bottom-nav a[aria-label="Riven Data"]').click();
    cy.location('pathname').should('eq', '/riven/data');
    cy.contains('h1', 'Riven Data').should('be.visible');
    cy.get('.hub-bottom-nav a[aria-label="Riven Data"]').should('have.attr', 'aria-current', 'page');
  });

  it('navigates to codex from bottom nav', () => {
    cy.get('.hub-bottom-nav a[aria-label="Item Codex"]').click();
    cy.location('pathname').should('eq', '/codex');
    cy.contains('h1', 'Item Codex').should('be.visible');
    cy.get('.hub-bottom-nav a[aria-label="Item Codex"]').should('have.attr', 'aria-current', 'page');
  });

  it('opens open-world map from bottom nav dropdown', () => {
    cy.get('.hub-bottom-nav button[aria-label="Open World"]').click();
    cy.get('.hub-nav-popover', { timeout: 10000 }).should('be.visible');
    cy.get('.hub-nav-popover a[href="/poe/map"]').click();
    cy.location('pathname').should('eq', '/poe/map');
    cy.get('.leaflet-container', { timeout: 10000 }).should('exist');
  });
});
