const openWorlds = ['poe', 'vallis', 'deimos'] as const;

describe('Maps', () => {
  openWorlds.forEach((ow) => {
    describe(`${ow} map`, () => {
      beforeEach(() => {
        cy.visitHub(`/${ow}/map`);
      });

      it('loads leaflet map controls', () => {
        cy.get('.leaflet-container').should('exist');
        cy.get('.leaflet-control-zoom').should('exist');
        cy.get('.leaflet-control-layers').should('exist');
        cy.get('.leaflet-pane.leaflet-map-pane').should('exist');
      });
    });
  });
});

describe('Fish', () => {
  openWorlds.forEach((ow) => {
    describe(`${ow} fish data`, () => {
      beforeEach(() => {
        cy.visitHub(`/${ow}/fish`);
      });

      it('loads fish table rows', () => {
        cy.get('.hub-content-table.table-root').should('exist');
        cy.get('.table__body .table__row').should('have.length.gt', 5);
      });
    });
  });
});
