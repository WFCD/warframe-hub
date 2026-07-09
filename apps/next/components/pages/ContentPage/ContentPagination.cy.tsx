import React, { useState } from 'react';
import './ContentPage.component.scss';
import ContentPagination from './ContentPagination';

const PaginationHarness = () => {
  const [page, setPage] = useState(2);
  return <ContentPagination page={page} pageCount={6} onPageChange={setPage} />;
};

describe('ContentPagination', () => {
  it('renders sliding window and updates current page', () => {
    cy.mount(<PaginationHarness />);
    cy.get('nav[aria-label="Pagination"]').should('exist');
    cy.get('button[aria-label="Page 2"]').should('have.attr', 'aria-current', 'page');
    cy.get('button[aria-label="Page 3"]').click();
    cy.get('button[aria-label="Page 3"]').should('have.attr', 'aria-current', 'page');
    cy.get('button[aria-label="First page"]').should('not.be.disabled');
    cy.get('button[aria-label="Last page"]').click();
    cy.get('button[aria-label="Page 6"]').should('have.attr', 'aria-current', 'page');
  });

  it('hides when only one page exists', () => {
    cy.mount(<ContentPagination page={1} pageCount={1} onPageChange={() => {}} />);
    cy.get('nav[aria-label="Pagination"]').should('not.exist');
  });
});
