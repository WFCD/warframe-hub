import React from 'react';
import AlertPanel from './AlertPanel.component';

describe('AlertPanel', () => {
  it('renders mission text and right-aligned timer/reward groups', () => {
    cy.mount(
      <AlertPanel
        alerts={[
          {
            id: 'alert-1',
            activation: '2026-07-06T00:00:00.000Z',
            expiry: '2026-07-07T00:00:00.000Z',
            mission: {
              node: 'Cervantes (Earth)',
              type: 'Exterminate',
              faction: 'Grineer',
              minEnemyLevel: 10,
              maxEnemyLevel: 15,
              archwingRequired: true,
              reward: {
                items: ['Orokin Catalyst Blueprint'],
                countedItems: [{ key: 'endo', type: 'Endo', count: 150 }],
                credits: 20000,
              },
            },
          },
        ]}
      />
    );

    cy.get('.hub-panel-row').should('have.length.at.least', 2);
    cy.contains('Cervantes (Earth)').should('exist');
    cy.contains('Exterminate').should('exist');
    cy.contains('Grineer').should('exist');
    cy.contains('Level:').should('exist');
    cy.contains('10-15').should('exist');
    cy.contains('{{').should('not.exist');
    cy.get('.hub-panel-row-side').should('exist');
    cy.get('.hub-alert-rewards .chip').should('have.length.at.least', 2);
    cy.contains('20000cr').should('exist');
  });
});
