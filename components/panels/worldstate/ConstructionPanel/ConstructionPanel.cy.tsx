import React from 'react';
import ConstructionPanel from './ConstructionPanel.component';

describe('ConstructionPanel', () => {
  it('renders progress rings when construction data is present', () => {
    cy.mount(
      <ConstructionPanel
        construction={{
          id: 'construction-1',
          fomorianProgress: '42',
          razorbackProgress: '17',
        }}
      />
    );

    cy.get('.construction .construction-ring-value').should('have.length', 2);
    cy.contains('42%').should('exist');
    cy.contains('17%').should('exist');
  });

  it('shows empty state when construction payload is missing', () => {
    cy.mount(<ConstructionPanel construction={{ fomorianProgress: 0, razorbackProgress: 0 }} />);
    cy.get('.no-content-warning').should('exist');
  });
});
