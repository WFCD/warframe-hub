import React from 'react';
import NewsPanel from './NewsPanel.component';

describe('NewsPanel', () => {
  it('renders news links with relative timestamps', () => {
    cy.mount(
      <NewsPanel
        news={[
          {
            id: 'news-1',
            message: 'TennoCon 2026',
            link: 'https://warframe.com',
            date: '2026-01-01T00:00:00.000Z',
            translations: { en: 'TennoCon 2026 announcement' },
          },
        ]}
      />
    );

    cy.get('.news').should('exist');
    cy.contains('.hub-news-label', 'TennoCon 2026 announcement').should('exist');
  });
});
