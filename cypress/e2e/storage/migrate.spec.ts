describe('Storage migration', () => {
  it('splits legacy vuex into hub.v1.* keys', () => {
    const legacy = {
      platform: 'pc',
      theme: 'night',
      locale: 'en',
      components: {},
      trackables: { rewardTypes: {}, eventTypes: {} },
      fissurePlanets: {},
      fissureDisplays: 'fissures-storms',
      soundFilters: [],
      notificationsAllowed: 'default',
      notifiedIds: { pc: [], ps4: [], xb1: [], switch: [] },
      poeMapToggles: { 'Map Label-toggle-value': true },
      worldstates: { pc: { timestamp: '2000-01-01T01:00:00.000Z' } },
    };

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('vuex', JSON.stringify(legacy));
        win.localStorage.setItem('cache', JSON.stringify({ synthData: [], rivens: { pc: [] } }));
      },
    });

    cy.window().its('localStorage').invoke('getItem', 'hub.v1.prefs').should('not.be.null');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('vuex')).to.be.null;
      expect(win.localStorage.getItem('cache')).to.be.null;
    });
  });
});
