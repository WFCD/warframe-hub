/* globals $, COMPONENTS, cloneTemplate, cloneLabel,
   parseRewards, getFactionPicture */

function getLabelColor(faction) {
  switch (faction) {
  case 'Corpus':
    return 'label-info';
  case 'Grineer':
    return 'label-danger';
  case 'Infested':
    return 'label-success';
  case 'Corrupted':
    return 'label-warning';
  default:
    return 'label-default';
  }
}

function getProgressBarColor(faction) {
  switch (faction) {
  case 'Corpus':
    return 'corpus-invasion';
  case 'Grineer':
    return 'grineer-invasion';
  case 'Infested':
    return 'infested-invasion';
  case 'Corrupted':
    return 'corrupted-invasion';
  default:
    return 'default-invasion';
  }
}

COMPONENTS.invasions = {
  id: 'invasions',
  worldStateKey: 'invasions',
  parse(data) {
    let numInvasions = 0;

    data.forEach(invasion => {
      const invasionElement = $(`#${invasion.id}`);
      if (invasionElement.length !== 0) {
        if (invasion.completed) {
          invasionElement.remove();
        } else {
          this.update(invasion, invasionElement);
          numInvasions += 1;
        }
      } else if (!invasion.completed) {
        this.add(invasion);
        numInvasions += 1;
      }
    });

    if (numInvasions > 0) {
      $('#invasiontitle').html('*End time is estimated');
    } else {
      $('#invasiontitle').html('No active invasions :(');
    }
  },
  add(invasion) {
    const invasionElement = cloneTemplate(this.id);
    invasionElement.attr('id', invasion.id);

    invasionElement.find('.node').html(invasion.node);
    invasionElement.find('.desc').html(invasion.desc);

    const rewardsElement = invasionElement.find('.rewards');
    ['attack', 'defend'].forEach(side => {
      const factionName = invasion[`${side}ingFaction`];
      const labelColor = getLabelColor(factionName);
      const literalSide = (side === 'attack' ? 'left' : 'right');
      const rewards = parseRewards(invasion[`${side}erReward`]);

      for (const item of rewards) {
        cloneLabel(literalSide, labelColor, item)
          .appendTo(rewardsElement);
      }

      invasionElement
        .find(`.${side}`).addClass(getProgressBarColor(factionName))
        .find('img').attr('src', getFactionPicture(factionName));
    });

    this.update(invasion, invasionElement);

    $('#invasionbody').before(invasionElement);
  },
  update(invasion, invasionElement) {
    const attackPercent = Math.floor(invasion.vsInfestation
      ? invasion.completion / 2
      : invasion.completion);
    const defendPercent = 100 - attackPercent;

    const attackBar = invasionElement.find('.attack');
    const defendBar = invasionElement.find('.defend');

    if (invasion.count > 0) {
      attackBar.addClass('winning-right');
      defendBar.removeClass('winning-left');
    } else {
      attackBar.removeClass('winning-right');
      defendBar.addClass('winning-left');
    }

    attackBar.css('width', `${attackPercent}%`)
      .attr('aria-valuenow', `${attackPercent}%`);
    defendBar.css('width', `${defendPercent}%`)
      .attr('aria-valuenow', `${defendPercent}%`);

    invasionElement.find('.eta').html(invasion.eta);
  },
  cleanup() {
    $('#invasionList').children().not('#invasionbody').remove();
  },
};
