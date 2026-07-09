import React from 'react';
import FissuresPanel from './FissuresPanel.component';

const sampleFissure = {
  id: 'fissure-test',
  node: 'Lua (Lua)',
  missionType: 'Survival',
  tier: 'Lith',
  tierNum: 1,
  activation: new Date().toISOString(),
  expiry: new Date(Date.now() + 3_600_000).toISOString(),
};

describe('FissuresPanel', () => {
  it('renders fissure rows from fixture data', () => {
    cy.mount(<FissuresPanel fissures={[sampleFissure]} variant="fissures" />);
    cy.get('.fissures').should('exist');
    cy.get('.hub-panel-row').should('have.length.at.least', 1);
    cy.get('.hub-panel-row-side').should('have.length.at.least', 1);
  });

  it('shows void storm icon in header for void storms variant', () => {
    cy.mount(<FissuresPanel fissures={[]} variant="voidStorms" />);
    cy.get('.void-storms .hub-panel-title-icon').should('exist');
  });

  it('shows steel path icon in header for steel path variant', () => {
    cy.mount(<FissuresPanel fissures={[]} variant="steelPathFissures" />);
    cy.get('.steel-path-fissures .hub-panel-title-icon').should('exist');
  });

  it('cycles omnia tier icons', () => {
    const omniaFissure = {
      id: 'omnia-test',
      node: 'Yuvarium',
      missionType: 'Conjunction Survival',
      tier: 'Omnia',
      tierNum: 6,
      activation: new Date().toISOString(),
      expiry: new Date(Date.now() + 3_600_000).toISOString(),
    };

    cy.mount(<FissuresPanel fissures={[omniaFissure]} variant="fissures" />);
    cy.get('.hub-fissure-tier-icon img').should('have.attr', 'src').and('include', 'fissures/1.svg');
    cy.wait(1600);
    cy.get('.hub-fissure-tier-icon img[alt="Omnia"]').should('have.attr', 'src').and('include', 'fissures/2.svg');
  });
});
