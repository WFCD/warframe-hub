/* globals $, moment, Cookies */

let worldState;
let updateTime;
let platformSwapped = false;

// Cetus timer stuff
let cetusIsDay;
let cetusCurrentTitle;
let cetusCurrentTitleTimezone;
let cetusCurrentIndicator;
let cetusCurrentIndicatorColor;

// Earth timer stuff
let earthIsDay;
let earthCurrentTitle;
let earthCurrentTitleTimezone;
let earthCurrentIndicator;
let earthCurrentIndicatorColor;

// Update worldstate timestamp
function updateWorldStateTime() {
  document.getElementById('worldstateinfo').setAttribute('data-original-title', `World State for ${
    Cookies.get('platform')} updated at ${moment(updateTime).format('MMMM Do YYYY, h:mm:ss a')}`);
}

// Helper function to display duration in human readable format, short version
function formatDurationShort(duration) {
  let timeText = '';
  if (duration.days()) {
    timeText += `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  } else if (duration.hours()) {
    timeText += `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  } else if (duration.minutes()) {
    timeText += `${duration.minutes()}m ${duration.seconds()}s`;
  } else {
    timeText += `${duration.seconds()}s`;
  }
  return timeText;
}

// Helper function to grab objects based on inner tags
function getObjects(obj, key, val) {
  let objects = [];
  for (const objKey of Object.keys(obj)) {
    if (typeof obj[objKey] === 'object') {
      objects = objects.concat(getObjects(obj[objKey], key, val));
    } else if (objKey === key && obj[objKey] === val) {
      objects.push(obj);
    }
  }
  return objects;
}

// Update data that is being used by this page
function updateDataDependencies() {
  cetusIsDay = worldState.cetusCycle.isDay;
  earthIsDay = worldState.earthCycle.isDay;
}

function updateEarthTitle() {
  if (!earthIsDay) {
    earthCurrentIndicator = 'Night';
    earthCurrentIndicatorColor = 'darkblue';
    earthCurrentTitle = 'Time until day: ';
    earthCurrentTitleTimezone = 'Time at day: ';
  } else {
    earthCurrentIndicator = 'Day';
    earthCurrentIndicatorColor = 'orange';
    earthCurrentTitle = 'Time until night: ';
    earthCurrentTitleTimezone = 'Time at night: ';
  }
}

function updateCetusTitle() {
  if (!cetusIsDay) {
    cetusCurrentIndicator = 'Night';
    cetusCurrentIndicatorColor = 'darkblue';
    cetusCurrentTitle = 'Time until day: ';
    cetusCurrentTitleTimezone = 'Time at day: ';
  } else {
    cetusCurrentIndicator = 'Day';
    cetusCurrentIndicatorColor = 'orange';
    cetusCurrentTitle = 'Time until night: ';
    cetusCurrentTitleTimezone = 'Time at night: ';
  }
}

function updateCetusCycle() {
  let expiryTime = moment(worldState.cetusCycle.expiry).unix();
  const currentTime = moment().unix();

  // Oh no, cycle expired before we can fetch a new one
  if (currentTime > expiryTime) {
    cetusIsDay = !cetusIsDay;
    if (cetusIsDay) {
      expiryTime = moment(worldState.cetusCycle.expiry).add(100, 'm').unix(); // Add 100 min for day, temporarily
    } else {
      expiryTime = moment(worldState.cetusCycle.expiry).add(50, 'm').unix(); // Add 50 min for night, temporarily
    }
  }

  updateCetusTitle();

  const cycleIndicator = $('#cetuscycleindicator');
  cycleIndicator.html(cetusCurrentIndicator);
  if (!cycleIndicator.hasClass(cetusCurrentIndicatorColor)) {
    cycleIndicator.attr('class', cetusCurrentIndicatorColor);
    cycleIndicator.addClass('pull-right');
  }

  $('#cetuscycletitle').html(cetusCurrentTitle);
  $('#cetustimezonetitle').html(cetusCurrentTitleTimezone);
  $('#cetustimezonetime').html(moment.unix(expiryTime).format('h:mm:ss a, MM/DD/YYYY'));

  const timeBadge = $('#cetuscycletime');
  timeBadge.attr('data-endtime', expiryTime);
  timeBadge.addClass('label timer');
}

function updateEarthCycle() {
  let expiryTime = moment(worldState.earthCycle.expiry).unix();
  const currentTime = moment().unix();

  // Oh no, cycle expired before we can fetch a new one
  if (currentTime > expiryTime) {
    cetusIsDay = !cetusIsDay;
    expiryTime = moment(worldState.earthCycle.expiry).add(4, 'h').unix(); // Add 4hrs, temporarily
  }

  updateEarthTitle();

  const cycleIndicator = $('#earthcycleindicator');
  cycleIndicator.html(earthCurrentIndicator);
  if (!cycleIndicator.hasClass(earthCurrentIndicatorColor)) {
    cycleIndicator.attr('class', earthCurrentIndicatorColor);
    cycleIndicator.addClass('pull-right');
  }

  $('#earthcycletitle').html(earthCurrentTitle);
  $('#earthtimezonetitle').html(earthCurrentTitleTimezone);
  $('#earthtimezonetime').html(moment.unix(expiryTime).format('h:mm:ss a, MM/DD/YYYY'));

  const timeBadge = $('#earthcycletime');
  timeBadge.attr('data-endtime', expiryTime);
  timeBadge.addClass('label timer');
}

function updateCetusBountyTimer() {
  const cetusBlock = getObjects(worldState, 'syndicate', 'Ostrons');
  if (cetusBlock !== null && cetusBlock[0]) {
    const cetus = cetusBlock[0];

    const expiryTime = moment(cetus.expiry).unix();
    const activateTime = moment(cetus.activation).unix();
    const currentTime = moment().unix();

    if (currentTime < activateTime) {
      $('#cetusbountytitle').html('New bounties in:');
      const timeBadge = $('#cetusbountytime');
      timeBadge.attr('data-endtime', activateTime);
      timeBadge.addClass('label timer');
      timeBadge.show();
    } else if (currentTime > activateTime && currentTime < expiryTime) {
      $('#cetusbountytitle').html('Bounties expire in:');
      const timeBadge = $('#cetusbountytime');
      timeBadge.attr('data-endtime', expiryTime);
      timeBadge.addClass('label timer');
      timeBadge.show();
    } else {
      $('#cetusbountytitle').html('Bounties expired, waiting for update...');
      const timeBadge = $('#cetusbountytime');
      timeBadge.removeClass('label timer');
      timeBadge.hide();
    }
  } else {
    $('#cetusbountytitle').html('No bounty information, waiting for update...');
    const timeBadge = $('#cetusbountytime');
    timeBadge.removeClass('label timer');
    timeBadge.hide();
  }
}

function updateVoidTraderInventory() {
  const voidTraderInventory = worldState.voidTrader.inventory;
  if (voidTraderInventory.length !== 0) {
    if (document.getElementById(worldState.voidTrader.id) === null) {
      if (platformSwapped && document.getElementsByClassName('voidTraderInventory')) {
        $('.voidTraderInventory').remove();
      }

      const inventoryString = `${'<div class="panel panel-primary voidTraderInventory" ' +
                'style="margin-left:5%; margin-right:5%" ' +
                'id="'}${worldState.voidTrader.id}">\n<div class="panel-heading">\n` +
                `<h3 class="panel-title">${worldState.voidTrader.character} Inventory` +
                '<a href="#voidTraderInventoryPanel" data-toggle="collapse">' +
                '<span class="glyphicon glyphicon-triangle-bottom pull-right"></span></a></h3>\n' +
                '</div>\n' +
                '<div class="panel-body collapse" id="voidTraderInventoryPanel">\n' +
                '<table class="table table-striped table-hover ">\n' +
                '<thead>\n' +
                '<tr>\n' +
                '<th class="text-center">Item Name</th>\n' +
                '<th class="text-center">Ducats</th>\n' +
                '<th class="text-center">Credits</th>\n' +
                '</tr>\n' +
                '</thead>\n' +
                '<tbody id="voidTraderInventoryContent">\n' +
                '</tbody>\n' +
                '</table>\n' +
                '</div>\n' +
                '</div>';
      const elementBody = $('#voidTraderBody');
      elementBody.append(inventoryString);
      elementBody.show();
      for (const currentItem of voidTraderInventory) {
        const itemString = `<tr><td>${currentItem.item}</td>` +
                  `<td>${currentItem.ducats}</td><td>${currentItem.credits}</td></tr>`;
        $('#voidTraderInventoryContent').append(itemString);
      }
    }
  } else {
    if (document.getElementsByClassName('voidTraderInventory')) {
      $('.voidTraderInventory').remove();
    }
  }
}

function updateVoidTrader() {
  const {voidTrader} = worldState;
  if (voidTrader) {
    const expiryTime = moment(voidTrader.expiry).unix();
    const activateTime = moment(voidTrader.activation).unix();
    const currentTime = moment().unix();

    if (currentTime < activateTime) {
      $('#voidtradertitle').html(`${voidTrader.character} arrives in:`);
      $('#voidtradertimezonetitle').html('Arrives at:');
      $('#voidtradertimezonetime').html(moment.unix(activateTime).format('h:mm:ss a, MM/DD/YYYY'));

      const timeBadge = $('#voidtradertime');
      timeBadge.attr('data-endtime', activateTime);
      timeBadge.addClass('label timer');
      timeBadge.show();
    } else if (currentTime > activateTime && currentTime < expiryTime) {
      $('#voidtradertitle').html(`${voidTrader.character} leaves in:`);
      $('#voidtradertimezonetitle').html('Leaves at:');
      $('#voidtradertimezonetime').html(moment.unix(expiryTime).format('h:mm:ss a, MM/DD/YYYY'));

      const timeBadge = $('#voidtradertime');
      timeBadge.attr('data-endtime', expiryTime);
      timeBadge.addClass('label timer');
      timeBadge.show();
    } else {
      $('#voidtradertitle').html('Void Trader expired, waiting for update...');
      $('#voidtradertimezonetitle').html('');
      $('#voidtradertimezonetime').html('');

      const timeBadge = $('#voidtradertime');
      timeBadge.removeClass('label timer');
      timeBadge.hide();
    }
  } else {
    $('#voidtradertitle').html('No Void Trader available, waiting for update...');
    $('#voidtradertimezonetitle').html('');
    $('#voidtradertimezonetime').html('');

    const timeBadge = $('#voidtradertime');
    timeBadge.removeClass('label timer');
    timeBadge.hide();
  }
}

function calculateInventory(total, sold) {
  return `${total - sold}/${total}`;
}

const cleanupDailyDeals = (dailyDeals) => {
  if (platformSwapped && document.getElementsByClassName('dailyDealsInventory')) {
    $('.dailyDealsInventory').remove();
  } else if ($('.dailyDealsInventory').attr('id') !== dailyDeals[0].id) {
    $('.dailyDealsInventory').remove();
  }
};

function updateDarvoDeals() {
  const {dailyDeals} = worldState;
  if (dailyDeals.length !== 0) {
    $('#darvotitle').hide();
    if (document.getElementById(dailyDeals[0].id) === null) {
      cleanupDailyDeals(dailyDeals);

      const inventoryString = `<table class="table dailyDealsInventory" style="table-layout: fixed" id="${
        dailyDeals[0].id}">\n` +
                '<thead>\n' +
                '<tr>\n' +
                '<th class="text-center col-xs-2">Item</th>\n' +
                '<th class="text-center col-xs-2">% Off</th>\n' +
                '<th class="text-center col-xs-2"><img style="width: 20px;height: 20px;" src="img/plat.png" /></th>\n' +
                '<th class="text-center col-xs-2">Stock</th>\n' +
                '<th class="text-center col-xs-4"></th>\n' +
                '</tr>\n' +
                '</thead>\n' +
                '<tbody id="dailyDealsInventory">\n' +
                '</tbody>\n' +
                '</table>';
      $('#darvobody').append(inventoryString);

      for (const currentItem of dailyDeals) {
        const itemString = `<tr><td>${currentItem.item}</td><td>${currentItem.discount}%</td><td>${currentItem.salePrice}</td><td>${
          calculateInventory(currentItem.total, currentItem.sold)}</td>` +
                    `<td style="padding-right:0;"><span class="label timer pull-right" data-endtime="${moment(currentItem.expiry).unix()}"></span></td></tr>`;
        $('#dailyDealsInventory').append(itemString);
      }
    }
  } else if (document.getElementsByClassName('dailyDealsInventory')) {
    $('.dailyDealsInventory').remove();
    document.getElementById('darvotitle').innerText = 'No current deals :(';
    $('#darvotitle').show();
  }
}

function updateAlerts() {
  const {alerts} = worldState;
  if (alerts.length !== 0) {
    $('#alerttitle').hide();
    if (platformSwapped && document.getElementById('alertList')) {
      $('#alertList').children().not('#alertbody').remove();
    }

    if (document.getElementById('alertList').children.length >= 1) {
      for (const alert of alerts) {
        if ($(`#${alert.id}`).length === 0) {
          let alertRow = `<li class="list-group-item list-group-item-borderless" id="${alert.id}">`;

          // Check if archwing is required for mission
          if (alert.mission.archwingRequired) {
            alertRow += '<img title="Archwing Required for Mission" src="https://i.imgur.com/R1kpRx4.png" class="archwing" height="16px" /> ';
          }
          if (alert.mission.nightmare) {
            alertRow += '<img title="Nightmare Mission" src="https://i.imgur.com/x5XoktW.png" class="nightmare" height="16px" /> ';
          }
          alertRow += `<b>${alert.mission.node}</b>`;
          alertRow += `<span id="alerttimer${alert.id}" class="label timer pull-right" data-starttime="${moment(alert.activation).unix()}" ` +
                        `data-endtime="${moment(alert.expiry).unix()}"></span>`;

          if (alert.mission.reward.items.length !== 0) {
            for (const item of alert.mission.reward.items) {
              alertRow += `<span class="label label-info pull-right" style="margin-right: 5px">${item}</span>`;
            }
          }
          if (alert.mission.reward.countedItems.length !== 0) {
            for (const countedItem of alert.mission.reward.countedItems) {
              alertRow += `<span class="label label-info pull-right" style="margin-right: 5px">${countedItem.count} ${countedItem.type}</span>`;
            }
          }
          if (alert.mission.reward.items.length === 0
                          && alert.mission.reward.countedItems.length === 0) {
            alertRow += `<span class="label label-default pull-right" style="margin-right: 5px">${alert.mission.reward.credits}cr</span>`;
          }

          alertRow += `<br><b>${alert.mission.type}</b> (${alert.mission.faction})` +
                        ` | <b>Level: </b>${alert.mission.minEnemyLevel}-${alert.mission.maxEnemyLevel}`;

          alertRow += '</li>';
          $('#alertbody').before(alertRow);
        } else {
          const timer = $(`#alerttimer${alert.id}`);
          timer.attr('data-starttime', moment(alert.activation).unix());
          timer.attr('data-endtime', moment(alert.expiry).unix());
        }
      }
    } else {
      for (const alert of alerts) {
        let alertRow = `<li class="list-group-item list-group-item-borderless" id="${alert.id}">`;

        // Check if archwing is required for mission
        if (alert.mission.archwingRequired) {
          alertRow += '<span class="glyphicon glyphicon-plane"></span>';
        }
        alertRow += `<b>${alert.mission.node}</b> | ${alert.mission.type} (${alert.mission.faction})`;
        alertRow += `<span id="alerttimer${alert.id}" class="label timer pull-right" data-starttime="${moment(alert.activation).unix()}" ` +
                    `data-endtime="${moment(alert.expiry).unix()}"></span></li>`;
        $('#alertbody').before(alertRow);
      }
    }
  } else if (document.getElementById('alertList')) {
    $('#alertList').children().not('#alertbody').remove();
    document.getElementById('alerttitle').innerText = 'No active alerts :(';
    $('#alerttitle').show();
  }
}

function getFactionPicture(faction) {
  switch (faction.toLowerCase()) {
  case 'corpus':
    return 'img/corpus.png';
  case 'grineer':
    return 'img/grineer.png';
  case 'infested':
    return 'img/infested.png';
  case 'infestation':
    return 'img/infested.png';
  default:
    return 'img/corpus.png';
  }
}

function updateSortie() {
  const {sortie} = worldState;

  if (sortie.variants.length !== 0) {
    $('#sortietitle').hide();

    if (platformSwapped || $('#sortieList').children().length === 0) {
      $('#sortieBoss').html(sortie.boss);
      $('#sortieFaction').html(`<img src="${getFactionPicture(sortie.faction)}" alt="${sortie.faction}" class="faction-image" />`);
      $('#sortieList').empty();

      sortie.variants.forEach((variant, index) => {
        let sortieRow = `<li class="list-group-item list-group-item-borderless variant" id="variant_${index}">`;

        sortieRow += `<b>${variant.missionType}</b> - <b>${variant.node}</b>`;
        sortieRow += `<br /><span data-toggle="tooltip" title="${variant.modifierDescription}" data-placement="right">${variant.modifier}</span></li>`;

        $('#sortieList').append(sortieRow);
      });
    }
  } else {
    $('#sortietitle').show();
    $('#sortieList').find('#sortieList').empty();
  }
}

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

function updateInvasions() {
  const {invasions} = worldState;
  let numInvasions = 0;

  if (invasions.length !== 0) {
    document.getElementById('invasiontitle').innerText = '*End time is estimated';

    if (platformSwapped && document.getElementById('invasionList')) {
      $('#invasionList').children().not('#invasionbody').remove();
    }

    invasions.forEach((invasion) => {
      if ($(`#${invasion.id}`).length !== 0) {
        if (invasion.completed) {
          $(`#${invasion.id}`).remove();
        } else {
          $(`#${invasion.id}_info`).html(`<b>${invasion.node}</b><br>${invasion.desc} (Ends in: ${invasion.eta})`);
          const attackPercent =
                Math.floor(((invasion.count + invasion.requiredRuns)
                 / (invasion.requiredRuns * 2)) * 100);
          const defendPercent = 100 - attackPercent;

          const attackBar = $(`#${invasion.id}_progress`).children()[0];
          const defendBar = $(`#${invasion.id}_progress`).children()[1];

          if (invasion.count > 0) {
            $(attackBar).addClass('winning-right');
            $(defendBar).removeClass('winning-left');
          } else {
            $(attackBar).removeClass('winning-right');
            $(defendBar).addClass('winning-left');
          }

          $(attackBar).css('width', `${attackPercent}%`).css('aria-valuenow', `${attackPercent}%`);
          $(defendBar).css('width', `${defendPercent}%`).css('aria-valuenow', `${defendPercent}%`);
          numInvasions += 1;
        }
      } else if (!invasion.completed) {
        let invasionRow = `<li class="list-group-item list-group-item-borderless" id="${invasion.id}" style="padding-top:10px;padding-bottom:0px;">`;
        invasionRow += `<div class="row text-center" id="${invasion.id}_info"><b>${invasion.node}</b><br>${invasion.desc} (Ends in: ${invasion.eta})*</div>`;

        invasionRow += '<div class="row" style="margin-bottom: 1px; margin-left:5px; margin-right:5px">';
        if (invasion.attackerReward.items.length !== 0) {
          for (const item of invasion.attackerReward.items) {
            invasionRow += `<span class="label ${getLabelColor(invasion.attackingFaction)} pull-left">${item}</span>`;
          }
        }
        if (invasion.attackerReward.countedItems.length !== 0) {
          for (const countedItem of invasion.attackerReward.countedItems) {
            invasionRow += `<span class="label ${getLabelColor(invasion.attackingFaction)} pull-left">${countedItem.count} ${countedItem.type}</span>`;
          }
        }
        if (invasion.defenderReward.items.length !== 0) {
          for (const item of invasion.defenderReward.items) {
            invasionRow += `<span class="label ${getLabelColor(invasion.defendingFaction)} pull-right">${item}</span>`;
          }
        }
        if (invasion.defenderReward.countedItems.length !== 0) {
          for (const countedItem of invasion.defenderReward.countedItems) {
            invasionRow += `<span class="label ${getLabelColor(invasion.defendingFaction)} pull-right">${countedItem.count} ${countedItem.type}</span>`;
          }
        }
        invasionRow += '</div>';

        invasionRow += `<div class="row" style="margin-bottom: 1px; margin-left:5px; margin-right:5px"><div class="progress" id="${invasion.id}_progress">`;
        const attackPercent =
              Math.floor(((invasion.count + invasion.requiredRuns)
               / (invasion.requiredRuns * 2)) * 100);
        const defendPercent = 100 - attackPercent;
        let attackWinning = '';
        let defendWinning = '';

        if (invasion.count > 0) {
          attackWinning = 'winning-right';
        } else {
          defendWinning = 'winning-left';
        }

        invasionRow += `<div class="progress-bar ${getProgressBarColor(invasion.attackingFaction)} attack ${attackWinning}" role="progressbar" style="width: ${attackPercent}%" aria-valuenow="${attackPercent}" aria-valuemin="0" aria-valuemax="100"><img class="pull-left" src="${getFactionPicture(invasion.attackingFaction)}" /></div>`;
        invasionRow += `<div class="progress-bar ${getProgressBarColor(invasion.defendingFaction)} defend ${defendWinning}" role="progressbar" style="width: ${defendPercent}%" aria-valuenow="${defendPercent}" aria-valuemin="0" aria-valuemax="100"><img class="pull-right" src="${getFactionPicture(invasion.defendingFaction)}" /></div>`;
        invasionRow += '</div></div></li>';

        $('#invasionbody').before(invasionRow);
        numInvasions += 1;
      }
    });

    if (numInvasions === 0) {
      document.getElementById('invasiontitle').innerText = 'No active invasions :(';
    }
  } else {
    document.getElementById('invasiontitle').innerText = 'No active invasions :(';
  }
}

function updatePage() {
  updateEarthCycle();
  updateCetusCycle();
  updateVoidTrader();
  updateVoidTraderInventory();
  updateDarvoDeals();
  updateAlerts();
  updateSortie();
  updateInvasions();
  updateCetusBountyTimer();
  updateWorldStateTime();
}

// Retrieves the easy to parse worldstate from WFCD
function getWorldState() {
  switch (Cookies.get('platform').toLowerCase()) {
  case 'ps4':
    $.getJSON('https://ws.warframestat.us/ps4', (data) => {
      worldState = JSON.parse(JSON.stringify(data));
      updateTime = (new Date()).getTime();
      updateDataDependencies();
      updatePage();
    });
    break;
  case 'xb1':
    $.getJSON('https://ws.warframestat.us/xb1', (data) => {
      worldState = JSON.parse(JSON.stringify(data));
      updateTime = (new Date()).getTime();
      updateDataDependencies();
      updatePage();
    });
    break;
  default:
    $.getJSON('https://ws.warframestat.us/pc', (data) => {
      worldState = JSON.parse(JSON.stringify(data));
      updateTime = (new Date()).getTime();
      updateDataDependencies();
      updatePage();
    });
    break;
  }
}

function updateResetTime() {
  // We want unix seconds, not unix millis
  const nextReset = (new Date()).setUTCHours(24, 0, 0, 0) / 1000;
  $('#resettimertitle').html('Time until new server day:');
  const timeBadge = $('#resettimertime');
  timeBadge.attr('data-endtime', nextReset);
  timeBadge.addClass('label timer');
}

function removeTimeBadgeColor(element) {
  element.removeClass('label-success');
  element.removeClass('label-primary');
  element.removeClass('label-danger');
  element.removeClass('label-warning');
  element.removeClass('label-default');
  element.removeClass('label-info');
}

function updateTimeBadges() {
  const labels = document.getElementsByClassName('timer');
  for (const label of labels) {
    const currentLabel = $(label);

    const activation = currentLabel.attr('data-starttime');
    let diffactivate;
    let durationactivate;

    if (typeof activation !== typeof undefined && activation !== false) {
      diffactivate = moment().diff(moment.unix(currentLabel.attr('data-starttime'))) * -1;
      durationactivate = moment.duration(diffactivate, 'milliseconds');
    }

    const diff = moment().diff(moment.unix(currentLabel.attr('data-endtime'))) * -1;
    const duration = moment.duration(diff, 'milliseconds');
    // Not started
    if (typeof diffactivate !== 'undefined' && diffactivate > 0) {
      if (!currentLabel.hasClass('label-info')) {
        removeTimeBadgeColor(currentLabel);
      }
      currentLabel.addClass('label-info');
      currentLabel.html(`Starts in: ${formatDurationShort(durationactivate)}`);
    } else if (diff < 0) { // Expired
      if (!currentLabel.hasClass('label-default')) {
        removeTimeBadgeColor(currentLabel);
      }
      currentLabel.addClass('label-default');
      currentLabel.html(`Expired: ${formatDurationShort(duration)}`);

      // Refreshes for things we don't need worldstate for
      switch (currentLabel.attr('id')) {
      case 'cetuscycletime':
        updateCetusCycle();
        break;
      case 'earthcycletime':
        updateEarthCycle();
        break;
      case 'resettimertime':
        updateResetTime();
        break;
      default:
        // If it is a alert timer, we can safely remove
        if (currentLabel.attr('id').includes('alerttimer')) {
          currentLabel.parent()[0].remove();
        }
      }
    } else if (diff < 600000) { // 0 min to 10 min
      if (!currentLabel.hasClass('label-danger')) {
        removeTimeBadgeColor(currentLabel);
      }
      currentLabel.addClass('label-danger');
      currentLabel.html(formatDurationShort(duration));
    } else if (diff < 1800000) { // 10 min to 30 min
      if (!currentLabel.hasClass('label-warning')) {
        removeTimeBadgeColor(currentLabel);
      }
      currentLabel.addClass('label-warning');
      currentLabel.html(formatDurationShort(duration));
    } else if (diff < 3600000) { // 30 min to 1 hour
      if (!currentLabel.hasClass('label-success')) {
        removeTimeBadgeColor(currentLabel);
      }
      currentLabel.addClass('label-success');
      currentLabel.html(formatDurationShort(duration));
    } else if (diff > 3600000) { // More than 1 hour
      if (!currentLabel.hasClass('label-primary')) {
        removeTimeBadgeColor(currentLabel);
      }
      currentLabel.addClass('label-primary');
      currentLabel.html(formatDurationShort(duration));
    }
  }

  setTimeout(updateTimeBadges, 1000);
}

function updatePlatformSwitch() {
  platformSwapped = false;
}

// Platform switcher anonymous functions
$(() => {
  $('#platform_pc').click(() => {
    $('#platform_ps4').removeClass('list-group-item-success');
    $('#platform_xb1').removeClass('list-group-item-success');
    $('#platform_pc').addClass('list-group-item-success');
    Cookies.set('platform', 'PC');
    platformSwapped = true;
    getWorldState();
    setTimeout(updatePlatformSwitch, 30000);
  });
});
$(() => {
  $('#platform_ps4').click(() => {
    $('#platform_pc').removeClass('list-group-item-success');
    $('#platform_xb1').removeClass('list-group-item-success');
    $('#platform_ps4').addClass('list-group-item-success');
    Cookies.set('platform', 'PS4');
    platformSwapped = true;
    getWorldState();
    setTimeout(updatePlatformSwitch, 30000);
  });
});
$(() => {
  $('#platform_xb1').click(() => {
    $('#platform_ps4').removeClass('list-group-item-success');
    $('#platform_pc').removeClass('list-group-item-success');
    $('#platform_xb1').addClass('list-group-item-success');
    Cookies.set('platform', 'XB1');
    platformSwapped = true;
    getWorldState();
    setTimeout(updatePlatformSwitch, 30000);
  });
});
// Set default platform to PC if there isn't one
if (Cookies.get('platform') === undefined) {
  Cookies.set('platform', 'PC');
} else {
  switch (Cookies.get('platform').toLowerCase()) {
  case 'ps4':
    $('#platform_pc').removeClass('list-group-item-success');
    $('#platform_xb1').removeClass('list-group-item-success');
    $('#platform_ps4').addClass('list-group-item-success');
    break;
  case 'xb1':
    $('#platform_ps4').removeClass('list-group-item-success');
    $('#platform_pc').removeClass('list-group-item-success');
    $('#platform_xb1').addClass('list-group-item-success');
    break;
  default:
    $('#platform_ps4').removeClass('list-group-item-success');
    $('#platform_xb1').removeClass('list-group-item-success');
    $('#platform_pc').addClass('list-group-item-success');
    break;
  }
}

// Main data refresh loop every 60 minutes
function update() {
  getWorldState();
  setTimeout(update, 60000);
}

update();
updateTimeBadges(); // Method has its own 1 second timeout
updateResetTime(); // This should not be called again unless the timer expires
