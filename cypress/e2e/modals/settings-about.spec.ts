const openSettings = () => {
  cy.get('.hub-navbar-end button[aria-label="Settings"]').hubClick();
  cy.get('.hub-settings-modal', { timeout: 10000 }).should('be.visible');
};

const openAbout = () => {
  cy.get('.hub-navbar-end button[aria-label="Information"]').hubClick();
  cy.get('.hub-about-modal', { timeout: 10000 }).should('be.visible');
};

describe('Settings and About modals', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visitHub('/');
    cy.get('.hub-navbar-start').should('be.visible');
  });

  it('opens settings with filter tabs', () => {
    openSettings();
    cy.contains('.hub-modal-title', 'Settings').should('be.visible');
    cy.contains('[role="tab"]', 'General').should('be.visible');
    cy.contains('[role="tab"]', 'Notifications').should('be.visible');
    cy.contains('[role="tab"]', 'Fissures').hubActivate();
    cy.contains('[role="tab"]', 'Sounds').should('be.visible');
    cy.get('.hub-settings-modal .hub-modal-close').hubClick();
    cy.get('.hub-settings-modal').should('not.exist');
  });

  it('persists platform preference from settings', () => {
    openSettings();
    cy.contains('.hub-modal-title', 'Settings').should('be.visible');
    cy.get('.hub-settings-general .hub-settings-select').first().find('button').hubClick();
    cy.get('[role="listbox"]', { timeout: 10000 }).should('be.visible');
    cy.contains('[role="option"]', 'Playstation Network').hubClick();
    // Prefs write is debounced (~300ms) — poll until persisted
    cy.window().should((win) => {
      const prefs = JSON.parse(win.localStorage.getItem('hub.v1.prefs') ?? '{}') as { platform?: string };
      expect(prefs.platform).to.eq('ps4');
    });
  });

  it('opens about with community and license tabs', () => {
    openAbout();
    cy.contains('.hub-modal-title', 'About').should('be.visible');
    cy.contains('[role="tab"]', 'Community Devs').should('be.visible');
    cy.get('a[href="https://github.com/WFCD/warframe-hub"]').should('exist');
    cy.contains('[role="tab"]', 'License').hubActivate();
    cy.get('a[href="https://www.apache.org/licenses/LICENSE-2.0"]').should('be.visible');
    cy.get('.hub-about-modal .hub-modal-close').hubClick();
    cy.get('.hub-about-modal').should('not.exist');
  });
});

describe('Settings and About modals mobile', () => {
  beforeEach(() => {
    cy.viewport(390, 844);
    cy.visitHub('/');
    cy.get('.hub-bottom-nav').should('be.visible');
    cy.get('.hub-navbar-start').should('not.exist');
  });

  it('opens settings as a full-height bottom sheet', () => {
    cy.hubOpenSettings();
    cy.get('.hub-modal--sheet.hub-settings-modal').should('be.visible');
    cy.get('.hub-modal--sheet .modal__dialog', { timeout: 10000 }).should(($dialog) => {
      const height = $dialog[0].getBoundingClientRect().height;
      expect(height).to.be.greaterThan(Cypress.config('viewportHeight') * 0.75);
    });
    cy.contains('[role="tab"]', 'General').should('be.visible');
    cy.contains('[role="tab"]', 'Notifications').should('be.visible');
    cy.get('.hub-settings-modal .hub-modal-close').hubClick();
    cy.get('.hub-settings-modal').should('not.exist');
  });
});
