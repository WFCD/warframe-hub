import React from 'react';
import VoidTraderPanel from './VoidTraderPanel.component';

describe('VoidTraderPanel', () => {
  it('renders baro inventory when active', () => {
    cy.mount(
      <VoidTraderPanel
        voidTrader={{
          activation: '2020-01-01T00:00:00.000Z',
          expiry: '2099-01-01T00:00:00.000Z',
          location: 'Larunda Relay',
          inventory: [
            { item: 'Primed Flow', ducats: 125, credits: 110000 },
            { item: 'Primed Continuity', ducats: 125, credits: 110000 },
          ],
        }}
      />
    );

    cy.get('.baro .hub-baro-table').should('exist');
    cy.contains('Primed Flow').should('exist');
    cy.get('.baro .hub-time-badge').should('exist');
  });
});
