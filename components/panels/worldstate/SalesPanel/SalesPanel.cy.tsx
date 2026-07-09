import React from 'react';
import SalesPanel from './SalesPanel.component';

describe('SalesPanel', () => {
  it('renders flash sale rows', () => {
    cy.mount(
      <SalesPanel
        sales={[
          {
            id: 'sale-1',
            item: 'T N W Market Bundle',
            premiumOverride: 145,
            expiry: '2099-01-01T00:00:00.000Z',
          },
        ]}
      />
    );

    cy.get('.sales .table__row').should('have.length.at.least', 1);
    cy.contains('T N W Market Bundle').should('exist');
    cy.get('.sales .hub-time-badge').should('exist');
  });
});
