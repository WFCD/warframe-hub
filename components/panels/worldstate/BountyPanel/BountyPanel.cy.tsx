import React from 'react';
import BountyPanel from './BountyPanel.component';
import MapsProvider from '@/lib/providers/MapsProvider';

const activeSyndicate = {
  activation: '2020-01-01T00:00:00.000Z',
  expiry: '2099-01-01T00:00:00.000Z',
  jobs: [
    {
      type: 'Capture the Grineer Commander',
      standingStages: [1230, 2220],
      enemyLevels: [5, 15],
      rewardPool: ['Reward A', 'Reward B'],
    },
  ],
};

describe('BountyPanel', () => {
  it('renders bounty jobs table when syndicate is active', () => {
    cy.mount(
      <MapsProvider>
        <BountyPanel syndicate={activeSyndicate} type='Ostrons' />
      </MapsProvider>
    );
    cy.get('.bounties .hub-bounty-panel').should('exist');
    cy.get('.hub-bounty-table .table__row').should('have.length.at.least', 1);
    cy.contains('Capture the Grineer Commander').should('exist');
  });

  it('shows empty state when syndicate is inactive', () => {
    cy.mount(
      <MapsProvider>
        <BountyPanel syndicate={{}} type='Ostrons' />
      </MapsProvider>
    );
    cy.get('.bounties .no-content-warning').should('exist');
  });
});
