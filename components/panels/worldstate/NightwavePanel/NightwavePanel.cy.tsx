import React from 'react';
import NightwavePanel from './NightwavePanel.component';

describe('NightwavePanel', () => {
  it('renders challenge title with side-aligned timer and standing badge', () => {
    cy.mount(
      <NightwavePanel
        nightwave={{
          activeChallenges: [
            {
              id: 'nw-1',
              title: 'Complete 3 missions',
              desc: 'Complete any three missions',
              activation: '2026-07-06T00:00:00.000Z',
              expiry: '2026-07-07T00:00:00.000Z',
              isDaily: true,
              reputation: 4500,
            },
          ],
        }}
      />
    );

    cy.contains('Complete 3 missions').should('exist');
    cy.get('.hub-panel-row-side .chip').should('contain', '4500');
    cy.get('.hub-panel-row-side .hub-time-badge').should('exist');
  });
});
