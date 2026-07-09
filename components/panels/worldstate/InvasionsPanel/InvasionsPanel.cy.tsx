import React from 'react';
import InvasionsPanel from './InvasionsPanel.component';

describe('InvasionsPanel', () => {
  it('renders invasion rows', () => {
    cy.mount(
      <InvasionsPanel
        invasions={[
          {
            id: 'inv-1',
            node: 'Cervantes',
            desc: 'Infested',
            attackingFaction: 'Infested',
            defendingFaction: 'Grineer',
            attackerReward: { countedItems: [], credits: 0, itemString: 'Fieldron' },
            defenderReward: { countedItems: [], credits: 0, itemString: 'Detonite' },
            vsInfestation: true,
            completion: 0.42,
            completed: false,
          },
        ]}
      />
    );

    cy.get('.invasions .hub-invasion-list').should('exist');
    cy.contains('Cervantes').should('exist');
  });
});
