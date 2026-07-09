import React from 'react';
import CycleTimers from '@/components/cycles/CycleTimers';
import { buildWorldstate } from '@wfcd/shared';

describe('CycleTimers', () => {
  it('renders compact cycle timer pills', () => {
    const worldstate = buildWorldstate();
    cy.mount(<CycleTimers worldstate={worldstate} />);

    cy.get('.hub-cycle-timers').should('exist');
    cy.get('.hub-cycle-timer-cell').should('have.length.at.least', 3);
    cy.get('.hub-cycle-timer-badge').should('have.length.at.least', 3);
    cy.contains('Earth').should('exist');
  });
});
