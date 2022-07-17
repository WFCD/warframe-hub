describe('Maps', () => {
  ['poe', 'vallis'].forEach((ow) => {
    beforeEach(() => {
      cy.visit(`http://localhost:3000/${ow}/map`);
      cy.wait(1000);
    });
    describe(`${ow} map`, () => {
      it('should load', () => {
        const map = cy.get('div.vue2leaflet-map');
        map.should('exist');
        cy.get('div.leaflet-control-zoom').should('exist');
        cy.get('div.leaflet-control-layers').should('exist');
        cy.get('div.leaflet-pane.leaflet-map-pane').should('exist');
      });
    });
  });
});
describe('Fish', () => {
  ['poe', 'vallis', 'deimos'].forEach((ow) => {
    beforeEach(() => {
      cy.visit(`http://localhost:3000/${ow}/fish`);
      cy.wait(1000);
    });
    describe(`${ow} fish data`, () => {
      it('should load', () => {
        const table = cy.get('div.fish-info');
        table.should('exist');
        const rowtypes = table.find('[role=rowgroup]');
        rowtypes.should('have.length', 2);
        const head = rowtypes.get('thead');
        head.should('exist');

        const rows = rowtypes.get('tbody');
        rows.should('exist');
        rows.children().should('have.length.gt', 10);

        const first = rows.children().get('tr:nth-of-type(1)');
        first.should('exist');
        first.children().should('have.length.gt', 13);
      });
    });
  });
});
