/* globals $, COMPONENTS, updateGrid, cloneTemplate, cloneLabel,
   manageTimer, platformSwapped, parseRewards, cloneTimer */

COMPONENTS.alerts = {
  id: 'alerts',
  worldStateKey: 'alerts',
  parse(data) {
    let numAlerts = 0;

    if (platformSwapped) {
      // this should happen when changing platforms, not here
      // I just want to change as little code as possible for now
      this.cleanup();
    }

    data.forEach(alert => {
      if (!alert.expired) {
        numAlerts += 1;
        if ($(`#${alert.id}`).length === 0) {
          this.add(alert);
        }
      }
      // if it's expired we don't care, timer will delete this (this.expired)
    });

    if (numAlerts > 0) {
      $('#alerttitle').hide();
    } else {
      $('#alerttitle').html('No active alerts :(').show();
    }
  },
  add(alert) {
    const {mission} = alert;
    const alertElement = cloneTemplate(this.id);
    alertElement.attr('id', alert.id);

    alertElement.find('.node').html(mission.node);
    alertElement.find('.mission-type').html(mission.type);
    alertElement.find('.faction').html(mission.faction);
    alertElement.find('.levels')
      .html(`${mission.minEnemyLevel}-${mission.maxEnemyLevel}`);
    alertElement.find('.credits').html(mission.reward.credits);

    if (mission.archwingRequired) {
      cloneTemplate('archwing').prependTo(alertElement).after(' ');
    }
    if (mission.nightmare) {
      cloneTemplate('nightmare').prependTo(alertElement).after(' ');
    }

    const newLine = alertElement.find('br');

    const timer = cloneTimer(alert.activation, alert.expiry, this.id);
    manageTimer(timer);
    newLine.before(timer);

    const rewards = parseRewards(mission.reward);
    for (const item of rewards) {
      newLine.before(cloneLabel('right', 'label-info', item)
        .css('margin-right', '5px'));
    }

    $('#alertbody').before(alertElement);
  },
  expired(timer) {
    timer.closest('li').remove();
    updateGrid();
  },
  cleanup() {
    $('#alertList').children().not('#alertbody').remove();
  },
};
