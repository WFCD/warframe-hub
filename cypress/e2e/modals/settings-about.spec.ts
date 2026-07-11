const openSettings = () => {
  cy.get('.hub-navbar button[aria-label="Settings"]').should('be.visible').click();
  cy.get('.hub-settings-modal', { timeout: 10000 }).should('be.visible');
};

const openAbout = () => {
  cy.get('.hub-navbar button[aria-label="Information"]').should('be.visible').click();
  cy.get('.hub-about-modal', { timeout: 10000 }).should('be.visible');
};

describe('Settings and About modals', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visitHub('/');
  });

  it('opens settings with filter tabs', () => {
    openSettings();
    cy.contains('.hub-modal-title', 'Settings').should('be.visible');
    cy.contains('[role="tab"]', 'General').should('be.visible');
    cy.contains('[role="tab"]', 'Notifications').should('be.visible');
    cy.contains('[role="tab"]', 'Fissures').click();
    cy.contains('[role="tab"]', 'Sounds').should('be.visible');
    cy.get('.hub-settings-modal .hub-modal-close').click();
    cy.get('.hub-settings-modal').should('not.exist');
  });

  it('persists platform preference from settings', () => {
    openSettings();
    cy.contains('.hub-modal-title', 'Settings').should('be.visible');
    cy.get('.hub-settings-general .hub-settings-select').first().click();
    cy.contains('[role="option"]', 'Playstation Network').click();
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
    cy.contains('[role="tab"]', 'License').click();
    cy.get('a[href="https://www.apache.org/licenses/LICENSE-2.0"]').should('be.visible');
    cy.get('.hub-about-modal .hub-modal-close').click();
    cy.get('.hub-about-modal').should('not.exist');
  });
});

describe('Settings and About modals mobile', () => {
  beforeEach(() => {
    cy.viewport(390, 844);
    cy.visitHub('/');
  });

  it('opens settings as a full-height bottom sheet', () => {
    openSettings();
    cy.get('.hub-modal--sheet.hub-settings-modal').should('be.visible');
    cy.get('.hub-modal--sheet .modal__dialog').should(($dialog) => {
      const height = $dialog.height() ?? 0;
      expect(height).to.be.greaterThan(700);
    });
    cy.contains('[role="tab"]', 'General').should('be.visible');
    cy.contains('[role="tab"]', 'Notifications').should('be.visible');
    cy.get('.hub-settings-modal .hub-modal-close').click();
    cy.get('.hub-settings-modal').should('not.exist');
  });
});
