import React from 'react';
import SortiePanel from './SortiePanel.component';

describe('SortiePanel', () => {
  it('renders boss row and mission modifiers', () => {
    cy.mount(
      <SortiePanel
        sortie={{
          faction: 'Grineer',
          boss: 'Kela & Rath',
          expiry: '2026-07-07T00:00:00.000Z',
          missions: [
            {
              missionType: 'Exterminate',
              node: 'Mercury',
              modifier: 'Enemy Physical Enhancement',
              modifierDescription: 'Enemies deal more physical damage',
            },
          ],
        }}
      />
    );

    cy.get('.sortie .hub-panel-row').should('have.length.at.least', 2);
    cy.contains('Kela & Rath').should('exist');
    cy.contains('Enemy Physical Enhancement').should('exist');
    cy.get('.hub-panel-row-side .hub-time-badge').should('exist');
  });
});
