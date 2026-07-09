import React from 'react';
import EventsPanel from './EventsPanel.component';

describe('EventsPanel', () => {
  it('renders active event description and timer', () => {
    cy.mount(
      <EventsPanel
        events={[
          {
            id: 'event-1',
            active: true,
            description: 'Thermia Fractures',
            activation: '2020-01-01T00:00:00.000Z',
            expiry: '2099-01-01T00:00:00.000Z',
            health: 50,
            maximumScore: 100,
            rewards: [{ items: ['Event Reward'] }],
          },
        ]}
      />
    );

    cy.get('.events').should('exist');
    cy.contains('Thermia Fractures').should('exist');
    cy.get('.hub-event-timer .hub-time-badge').should('exist');
  });
});
