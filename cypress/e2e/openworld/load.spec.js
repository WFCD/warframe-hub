describe('Maps', () => {
  ['poe', 'vallis'].forEach((ow) => {
    beforeEach(() => {
      cy.visit(`http://localhost:3000/${ow}/map`);
      cy.wait(1000);
    });
    describe(`${ow} map`, () => {
      it('should load', () => {
        cy.get('div.vue2leaflet-map').as('map');
        cy.get('@map').should('exist');
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
        cy.get('div.fish-info').as('fish');
        cy.get('@fish').should('exist');
        cy.get('@fish').find('[role=rowgroup]').as('rowtypes');
        cy.get('@rowtypes').should('have.length', 2);
        cy.get('@rowtypes').get('thead').as('head');
        cy.get('@head').should('exist');

        cy.get('@rowtypes').get('tbody').as('rows');
        cy.get('@rows').should('exist');
        cy.get('@rows').children().should('have.length.gt', 10);

        cy.get('@rows').children().get('tr:nth-of-type(1)').as('first');
        cy.get('@first').should('exist');
        cy.get('@first').children().should('have.length.gt', 13);
      });
    });
  });
});
