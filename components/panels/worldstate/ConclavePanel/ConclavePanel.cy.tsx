import React from 'react';
import ConclavePanel from './ConclavePanel.component';

describe('ConclavePanel', () => {
  it('renders challenge description with icon and side-aligned timer badge', () => {
    cy.mount(
      <ConclavePanel
        conclave={[
          {
            id: 'conclave-1',
            description: 'Win one match',
            activation: '2026-07-06T00:00:00.000Z',
            expiry: '2026-07-07T00:00:00.000Z',
            mode: 'Lunaro',
          },
        ]}
      />
    );

    cy.contains('Win one match').should('exist');
    cy.get('.hub-panel-row-main .hub-img').should('have.length.at.least', 1);
    cy.get('.hub-panel-row-side .hub-time-badge').should('have.length', 1);
  });
});
