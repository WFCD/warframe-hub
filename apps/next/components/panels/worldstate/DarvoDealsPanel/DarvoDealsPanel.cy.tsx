import React from 'react';
import DarvoDealsPanel from './DarvoDealsPanel.component';

describe('DarvoDealsPanel', () => {
  it('renders deal rows with platinum icon and timer', () => {
    cy.mount(
      <DarvoDealsPanel
        deals={[
          {
            id: 'darvo-1',
            item: 'Greater Naramon Lens',
            salePrice: 28,
            discount: 30,
            total: 100,
            sold: 100,
            expiry: '2099-01-01T00:00:00.000Z',
          },
        ]}
      />
    );

    cy.get('.darvo .table__row').should('have.length.at.least', 1);
    cy.contains('Greater Naramon Lens').should('exist');
    cy.get('.darvo .hub-img').should('exist');
    cy.get('.darvo .hub-time-badge').should('exist');
  });
});
