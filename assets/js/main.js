/* globals $, moment, Cookies, Draggabilly, Packery, updateGrid */

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

const fissureGlyphs = ['https://i.imgur.com/D595KoY.png', 'https://i.imgur.com/VpBDaZV.png', 'https://i.imgur.com/YOjBckN.png', 'https://i.imgur.com/nZ3FfpC.png'];

const getImage = (
  type,
  {
    className = undefined, image = undefined, title = undefined, forcePng = false,
  },
) => {
  if (typeof SVGRect !== 'undefined' && !forcePng) {
    return `<img src="img/${type}/${image}.svg" class="${className} inv" title="${title}" />`;
  } else if (type === 'fissure') {
    return `<img src="${fissureGlyphs[parseInt(image, 10) - 1]}" class="${className}" title="${title}" />`;
  } else if (type === 'archwing') {
    return `<img src="https://i.imgur.com/R1kpRx4.png" class="${className}" title="${title}" />`;
  } else if (type === 'nightmare') {
    return `<img src="https://i.imgur.com/x5XoktW.png" class="${className}" title="${title}" />`;
  }
  return `<img src="img/${type}/${image}.png" class="${className}" />`;
};

const setTheme = (themeName, superTheme, reset) => {
  const theme = $('#mode');
  const themecustom = $('#mode-custom');
  if (!reset) {
    if (theme.hasClass(themeName)) {
      setTheme(false, false, true);
    } else {
      theme.attr('href', `css/bootstrap-${superTheme}.min.css`);
      themecustom.attr('href', `css/main.${themeName}.css`);
      theme.removeClass();
      theme.addClass(themeName);
      Cookies.set('mode', themeName);
    }
  } else {
    theme.attr('href', 'css/bootstrap-default.min.css');
    themecustom.attr('href', 'css/main.css');
    theme.removeClass();
    Cookies.set('mode', 'day');
  }
  updateGrid();
};

// Update worldstate timestamp
function updateWorldStateTime() {
  if (document.getElementById('worldstateinfo')) {
    document.getElementById('worldstateinfo').setAttribute('data-original-title', `World State for ${
      Cookies.get('platform')} updated at ${moment(updateTime).format('MMMM Do YYYY, h:mm:ss a')}`);
  }
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
      /* eslint-disable prefer-template */
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
      /* eslint-enable prefer-template */
      const elementBody = $('#voidTraderBody');
      elementBody.append(inventoryString);
      elementBody.show();
      for (const currentItem of voidTraderInventory) {
        const itemString = `<tr><td>${currentItem.item}</td>` +
                  `<td>${currentItem.ducats}</td><td>${currentItem.credits}</td></tr>`;
        $('#voidTraderInventoryContent').append(itemString);
      }
    }
    $('#voidTraderInventoryPanel').on('shown.bs.collapse', updateGrid);
    $('#voidTraderInventoryPanel').on('hidden.bs.collapse', updateGrid);
  } else if (document.getElementsByClassName('voidTraderInventory')) {
    $('.voidTraderInventory').remove();
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

const cleanupDailyDeals = dailyDeals => {
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
                `<th class="text-center col-xs-2">${getImage('general', {image: 'plat', className: 'plat', forcePng: true})}</th>\n` +
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

const cleanupDeals = dailyDeals => {
  if (platformSwapped && document.getElementsByClassName('dealsInventory')) {
    $('.dealsInventory').remove();
  } else if ($('.dealsInventory').attr('id') !== dailyDeals[0].id) {
    $('.dealsInventory').remove();
  }
};

function updateDeals() {
  const {flashSales} = worldState;
  if (flashSales.length !== 0) {
    $('#dealstitle').hide();
    if (document.getElementById(flashSales[0].id) === null) {
      cleanupDeals(flashSales);

      const inventoryString = `<table class="table dealsInventory" style="table-layout: fixed" id="${
        flashSales[0].id}">\n` +
                '<thead>\n' +
                '<tr>\n' +
                '<th class="text-center col-xs-5">Item</th>\n' +
                `<th class="text-center col-xs-2">${getImage('general', {image: 'plat', className: 'plat', forcePng: true})}</th>\n` +
                '<th class="text-center col-xs-4"></th>\n' +
                '</tr>\n' +
                '</thead>\n' +
                '<tbody id="dealsInventory">\n' +
                '</tbody>\n' +
                '</table>';
      $('#dealsbody').append(inventoryString);

      for (const currentItem of flashSales) {
        const itemString = `<tr><td>${currentItem.item}</td><td>${currentItem.premiumOverride}</td>` +
                    `<td style="padding-right:0;"><span class="label timer pull-right" data-endtime="${moment(currentItem.expiry).unix()}"></span></td></tr>`;
        $('#dealsInventory').append(itemString);
      }
    }
  } else if (document.getElementsByClassName('dealsInventory')) {
    $('.dealsInventory').remove();
    document.getElementById('dealstitle').innerText = 'No current deals :(';
    $('#dealstitle').show();
  }
}

function updateAcolytes() {
  const {persistentEnemies} = worldState;
  if (persistentEnemies.length !== 0) {
    $('#acolytetitle').hide();
    if (platformSwapped && document.getElementById('alertList')) {
      $('#acolyteList').children().not('#acolytebody').remove();
    }

    if (document.getElementById('acolyteList').children.length >= 1) {
      for (const acolyte of persistentEnemies) {
        if ($(`#${acolyte.id}`).length === 0) {
          const lastDiscoveredTime = moment(acolyte.lastDiscoveredTime).unix();
          let acolyteRow = `<li class="list-group-item list-group-item-borderless" id="${acolyte.id}">`;
          acolyteRow += `<b>${acolyte.agentType}</b>`;
          acolyteRow += `<br><div style="margin-top:2px"><b>${acolyte.isDiscovered ? '' : 'Last '} At ${acolyte.lastDiscoveredAt}</b>` +
                        ` | <b>Level: </b>${acolyte.rank}` +
                        ` <span class="label label-primary pull-right" id="${acolyte.id}-lastDiscoveredTime">${moment.unix(lastDiscoveredTime).format('h:mm:ss a, MM/DD/YYYY')}</span>`;

          const remainingBar = $(`#${acolyte.id}_progress`).children()[0];
          const progressBar = $(`#${acolyte.id}_progress`).children()[1];

          if (acolyte.count > 0) {
            $(remainingBar).addClass('winning-right');
            $(progressBar).removeClass('winning-left');
          } else {
            $(remainingBar).removeClass('winning-right');
            $(progressBar).addClass('winning-left');
          }

          const remainingPercent = Math.floor(parseInt(acolyte.healthPercent * 100, 10));
          const progressPercent = 100 - remainingPercent;

          const remainingLabel = `<span id="${acolyte.id}-health">${(acolyte.healthPercent * 100).toFixed(2)}% Remaining</span>`;

          acolyteRow += '</div><div class="row" style="margin-bottom: 1px;">' +
            `<div class="progress" id="${acolyte.id}_progress" style="margin-left: 5px; margin-right: 5px;">` +
            `<div class="progress-bar grineer-invasion attack winning-left" role="progressbar" style="height: 20px; font-size: 12px; line-height:16px; width: ${remainingPercent}%" aria-valuenow="${remainingPercent}" aria-valuemin="0" aria-valuemax="100">` +
            `${remainingPercent > 0 ? remainingLabel : ''}</div>` +
            `<div class="progress-bar defend progress-bar-grey" role="progressbar" style="width: ${progressPercent}%; height: 20px; font-size: 12px; line-height:16px;" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100">` +
            `${remainingPercent === 0 ? remainingLabel : ''}</div>` +
            '</div>';

          acolyteRow += '</li>';
          $('#acolytebody').before(acolyteRow);
        } else {
          const lastDiscoveredTime = moment(acolyte.lastDiscoveredTime).unix();
          $(`#${acolyte.id}-health`).html(`${(acolyte.healthPercent * 100).toFixed(2)}%`);
          $(`#${acolyte.id}-lastDiscoveredTime`).html(moment.unix(lastDiscoveredTime).format('h:mm:ss a, MM/DD/YYYY'));
        }
      }
    }
  } else if (document.getElementById('acolyteList')) {
    $('#acolyteList').children().not('#acolytebody').remove();
    document.getElementById('acolytetitle').innerText = 'No active acolytes :(';
    $('#alerttitle').show();
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
            alertRow += `${getImage('general', {image: 'archwing', title: 'Archwing Required for Mission', className: 'archwing'})} `;
          }
          if (alert.mission.nightmare) {
            alertRow += `${getImage('general', {image: 'nightmare', title: 'Nightmare Mission', className: 'nightmare'})} `;
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

          alertRow += `<br><div style="margin-top:2px"><b>${alert.mission.type}</b> (${alert.mission.faction})` +
                        ` | <b>Level: </b>${alert.mission.minEnemyLevel}-${alert.mission.maxEnemyLevel}` +
                        ` | ${alert.mission.reward.credits}cr`;

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

        if (alert.mission.archwingRequired) {
          alertRow += `${getImage('general', {image: 'archwing', title: 'Archwing Required for Mission', className: 'archwing'})} `;
        }
        if (alert.mission.nightmare) {
          alertRow += `${getImage('general', {image: 'nightmare', title: 'Nightmare Mission', className: 'nightmare'})} `;
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

const cleanupBounties = dailyDeals => {
  if (platformSwapped && document.getElementsByClassName('bountiesList')) {
    $('.bountyListPanelWrapper').remove();
  } else if ($('.bountiesList').attr('id') !== dailyDeals[0].id) {
    $('.bountyListPanelWrapper').remove();
  }
};

function updateBounties() {
  const {syndicateMissions} = worldState;
  const ostronMissions = syndicateMissions.filter(syndicate => syndicate.syndicate === 'Ostrons')[0];
  const jobs = ostronMissions ? ostronMissions.jobs : [];
  if (jobs.length !== 0) {
    $('#bountytitle').hide();
    if (document.getElementById(jobs[0].id) === null) {
      cleanupBounties(jobs);
      /* eslint-disable prefer-template */
      const panelHeading = '<div class="panel-heading"><h3 class="panel-title"><a href="#bountyListPanelBody" data-toggle="collapse">Ostron Bounties<span class="glyphicon glyphicon-triangle-bottom pull-right"></span></a></h3></div>';

      // Table header, plat image
      const standingImg = getImage('general', {image: 'standing', className: 'standing'});
      const tableHeader = `<thead><tr><th class="text-center col-xs-4">Type</th><th class="text-center col-xs-3">${standingImg}</th><th class="text-center col-xs-4">Level Range</th><th class="text-center col-xs-5">Rewards</th></tr></thead>`;
      const tableBody = '<tbody id="bountiesList"></tbody>';
      const table = `<table class="table bountiesList" style="table-layout: fixed" id="${jobs[0].id}">${tableHeader}${tableBody}</table>`;

      const panelBody = `<div class="panel-body collapse" id="bountyListPanelBody">${table}</div>`;

      let panelWrapper;
      panelWrapper = `<div class="panel panel-primary bountyListPanelWrapper" style="margin-left:5%; margin-right:5%" id="${jobs[0].id}Panel">`;
      panelWrapper += panelHeading;
      panelWrapper += panelBody;
      panelWrapper += '</div>';

      /* eslint-enable prefer-template */
      $('#bountybody').append(panelWrapper);

      for (const job of jobs) {
        const itemString = `<tr><td>${job.type}</td><td>${job.standingStages.join(', ')}</td>` +
                    `<td>${job.enemyLevels[0]}-${job.enemyLevels[1]}</td>` +
                    `<td><ul>${job.rewardPool.map(reward => `<li>${reward}</li>`).join('')}</ul></td></tr>`;
        $('#bountiesList').append(itemString);
      }
      $('#bountyListPanelBody').on('shown.bs.collapse', updateGrid);
      $('#bountyListPanelBody').on('hidden.bs.collapse', updateGrid);
    }
  } else if (document.getElementsByClassNam('bountyListPanelWrapper')) {
    $('#bountiesList').remove();
    $('#bountytitle').text('No current deals :(');
    $('#bountytitle').show();
  }
}

function getFactionKey(faction) {
  switch (faction.toLowerCase()) {
  case 'corpus':
    return 'corpus';
  case 'grineer':
    return 'grineer';
  case 'infested':
  case 'infestation':
    return 'infested';
  case 'corrupted':
  case 'orokin':
  default:
    return 'corrupted';
  }
}

function updateSortie() {
  const {sortie} = worldState;

  if (sortie.variants.length !== 0) {
    $('#sortietitle').hide();

    if (platformSwapped || $('#sortieList').children().length === 0) {
      $('#sortieBoss').html(sortie.boss);
      $('#sortieFaction').html(getImage(
        'factions',
        {image: getFactionKey(sortie.faction), className: 'faction-image sortie-faction', title: sortie.faction},
      ));
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

function updateFissure() {
  const {fissures} = worldState;

  if (fissures.length !== 0) {
    $('#fissuretitle').hide();
    if (platformSwapped && document.getElementById('fissureList')) {
      $('#fissureList').children().not('#fissurebody').remove();
    }

    fissures.sort((a, b) => {
      const tierA = a.tierNum;
      const tierB = b.tierNum;
      if (tierA < tierB) { return -1; }
      if (tierA > tierB) { return 1; }
      return 0;
    });

    for (const fissure of fissures) {
      if ($(`#${fissure.id}`).length !== 0) {
        const timer = $(`#fissuretimer${fissure.id}`);
        timer.attr('data-starttime', moment(fissure.activation).unix());
        timer.attr('data-endtime', moment(fissure.expiry).unix());
      } else {
        let fissureRow = `<li class="list-group-item list-group-item-borderless" id="${fissure.id}">`;
        // fissure timer
        fissureRow += `<span id="fissuretimer${fissure.id}" class="label timer pull-right" data-starttime="${moment(fissure.activation).unix()}" ` +
                      `data-endtime="${moment(fissure.expiry).unix()}"></span>`;

        // fissure body
        fissureRow += `<span class= "fissure-body">${getImage('fissures', {image: fissure.tierNum, title: `Tier ${fissure.tierNum}`, className: 'fissure-icon'})}`;
        fissureRow += `<b>${fissure.node}</b> | ${fissure.missionType} | ${fissure.tier}</span>`;

        fissureRow += '</li>';
        $('#fissurebody').before(fissureRow);
      }
    }
  } else {
    $('#fissureList').children().not('#fissurebody').remove();
    document.getElementById('fissuretitle').innerText = 'No active Void Fissures :(';
    $('#fissuretitle').show();
  }
}

function updateNews() {
  let {news} = worldState;
  news = news.filter(article => article.translations.en);

  if (news.length !== 0) {
    $('#newstitle').hide();
    if (platformSwapped && document.getElementById('newsList')) {
      $('#newsList').children().not('#newsbody').remove();
    }

    news.sort((a, b) => {
      const timeA = moment(a.date).unix();
      const timeB = moment(b.date).unix();
      if (timeA < timeB) { return 1; }
      if (timeA > timeB) { return -1; }
      return 0;
    });

    for (const article of news) {
      if ($(`#${article.id}`).length !== 0) {
        $(`#newstime${article.id}`).html(`[${moment(article.date).fromNow()}] &#9;`);
      } else {
        let articleRow = `<li class="list-group-item list-group-item-borderless" id="${article.id}" style="padding-top:2px;padding-bottom:2px">`;
        articleRow += `<span id="newstime${article.id}" style="white-space:pre">[${moment(article.date).fromNow()}] &#9;</span><a href="${article.link}">${article.message}</a>`;
        articleRow += '</li>';

        if (article.priority) {
          $('#newstop').after(articleRow);
        } else {
          $('#newsbody').before(articleRow);
        }
      }
    }
  } else {
    $('#newsList').children().not('#newsbody').remove();
    document.getElementById('newstitle').innerText = 'No News to show :(';
    $('#newstitle').show();
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

    invasions.forEach(invasion => {
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
            // Include count only if more than 1
            if (countedItem.count > 1) {
              invasionRow += `<span class="label ${getLabelColor(invasion.attackingFaction)} pull-left">${countedItem.count} ${countedItem.type}</span>`;
            } else {
              invasionRow += `<span class="label ${getLabelColor(invasion.attackingFaction)} pull-left">${countedItem.type}</span>`;
            }
          }
        }
        if (invasion.defenderReward.items.length !== 0) {
          for (const item of invasion.defenderReward.items) {
            invasionRow += `<span class="label ${getLabelColor(invasion.defendingFaction)} pull-right">${item}</span>`;
          }
        }
        if (invasion.defenderReward.countedItems.length !== 0) {
          for (const countedItem of invasion.defenderReward.countedItems) {
            // Include count only if more than 1
            if (countedItem.count > 1) {
              invasionRow += `<span class="label ${getLabelColor(invasion.defendingFaction)} pull-right">${countedItem.count} ${countedItem.type}</span>`;
            } else {
              invasionRow += `<span class="label ${getLabelColor(invasion.defendingFaction)} pull-right">${countedItem.type}</span>`;
            }
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

        invasionRow += `<div class="progress-bar ${getProgressBarColor(invasion.attackingFaction)} attack ${attackWinning}" role="progressbar" style="width: ${attackPercent}%" aria-valuenow="${attackPercent}" aria-valuemin="0" aria-valuemax="100">` +
          `${getImage('factions', {image: getFactionKey(invasion.attackingFaction), className: 'pull-left faction-invasion-img'})}</div>`;
        invasionRow += `<div class="progress-bar ${getProgressBarColor(invasion.defendingFaction)} defend ${defendWinning}" role="progressbar" style="width: ${defendPercent}%" aria-valuenow="${defendPercent}" aria-valuemin="0" aria-valuemax="100">` +
          `${getImage('factions', {image: getFactionKey(invasion.defendingFaction), className: 'pull-right faction-invasion-img'})}</div>`;
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
  if (worldState) {
    updateEarthCycle();
    updateCetusCycle();
    updateVoidTrader();
    updateVoidTraderInventory();
    updateDarvoDeals();
    updateDeals();
    updateAcolytes();
    updateAlerts();
    updateBounties();
    updateCetusBountyTimer();
    updateSortie();
    updateFissure();
    updateNews();
    updateInvasions();
    updateWorldStateTime();
    updateGrid();
  }
}

// Retrieves the easy to parse worldstate from WFCD
function getWorldState() {
  $.getJSON(`https://api.warframestat.us/${Cookies.get('platform')}`, data => {
    worldState = JSON.parse(JSON.stringify(data));
    updateTime = (new Date()).getTime();
    updateDataDependencies();
    updatePage();
  });
}

function updateResetTime() {
  // This should not be called again unless the timer expires
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
        if (currentLabel.attr('id')
          && (currentLabel.attr('id').includes('alerttimer') || currentLabel.attr('id').includes('fissuretimer'))) {
          currentLabel.parent()[0].remove();
          updateGrid();
        }
      }
    } else {
      let color;

      if (diff < 600000) { // 0 min to 10 min
        color = 'label-danger';
      } else if (diff < 1800000) { // 10 min to 30 min
        color = 'label-warning';
      } else if (diff < 3600000) { // 30 min to 1 hour
        color = 'label-success';
      } else if (diff > 3600000) { // More than 1 hour
        color = 'label-primary';
      }

      if (!currentLabel.hasClass(color)) {
        removeTimeBadgeColor(currentLabel);
        currentLabel.addClass(color);
      }
      currentLabel.html(formatDurationShort(duration));
    }
  }

  setTimeout(updateTimeBadges, 1000);
}

function updatePlatformSwitch() {
  platformSwapped = false;
}

// Change color of active platform
function selectPlatform(platform) {
  const cls = 'list-group-item-success';
  $('.platform-picker li')
    .removeClass(cls)
    .filter(`[data-platform="${platform}"]`)
    .addClass(cls);
}

// Set default platform to PC if there isn't one
if (typeof Cookies.get('platform') === 'undefined') {
  Cookies.set('platform', 'pc');
}
selectPlatform(Cookies.get('platform'));

// Platform switcher
$('.platform-picker li').click(e => {
  const platform = $(e.currentTarget).attr('data-platform');
  selectPlatform(platform);
  Cookies.set('platform', platform);
  platformSwapped = true;
  getWorldState();
  setTimeout(updatePlatformSwitch, 30000);
});

// Set default component selections if there aren't any
[['acolytes'], ['cetus'], ['earth'], ['bounties'], ['alerts'],
  ['news'], ['invasions'], ['reset'], ['sortie'], ['fissures'],
  ['baro'], ['darvo'], ['deals', 'false']].forEach(([component, defValue]) => {
  let value = Cookies.get(component);
  if (typeof value === 'undefined') {
    if (typeof defValue === 'undefined') {
      value = 'true';
    } else {
      value = defValue;
    }
    Cookies.set(component, value);
  }
  if (value === 'true') {
    $(`.component-check[data-component="${component}"]`)
      .prop('checked', true);
  } else {
    $(`#component-${component}`).hide();
  }
});

// Prevent components menu from closing on label click
$('#component-selector > ul').click(e => {
  e.stopPropagation();
});

// Toggle component visibility on checkbox click
$('.component-check').click(e => {
  const target = $(e.target);
  const status = target.prop('checked');
  const component = target.attr('data-component');
  const componentElement = $(`#component-${component}`);

  Cookies.set(component, status);
  if (status) {
    componentElement.show();
  } else {
    componentElement.hide();
  }
  updateGrid();
});

// Show dropdowns that should be visible only on timers page
$('.platform-picker').removeClass('hide');
$('#component-selector').removeClass('hide');

// Packery closure
(() => {
  // source: https://codepen.io/desandro/pen/PZrXVv
  // add Packery.prototype methods

  // get JSON-friendly data for items positions
  Packery.prototype.getShiftPositions = function getShiftPositions() {
    return this.items.map(item => ({
      attr: item.element.getAttribute('id'),
      x: item.rect.x / this.packer.width,
    }));
  };

  Packery.prototype.initShiftLayout = function initShiftLayout(positions) {
    if (!positions) {
      // if no initial positions, run packery layout
      this.layout();
      return;
    }

    // eslint-disable-next-line no-underscore-dangle
    this._resetLayout();

    try {
      // set item order and horizontal position from saved positions
      this.items = positions.map(itemPosition => {
        const selector = `#${itemPosition.attr}`;
        const itemElem = this.element.querySelector(selector);
        const item = this.getItem(itemElem);
        item.rect.x = itemPosition.x * this.packer.width;
        return item;
      }, this);
      this.shiftLayout();
    } catch (error) {
      this.layout();
    }
  };

  // initialize Packery
  const grid = $('.grid').packery({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true,
    initLayout: false, // disable initial layout
  });

  // get saved dragged positions
  const initPositions = Cookies.getJSON('dragPositions');
  // init layout with saved positions
  grid.packery('initShiftLayout', initPositions);

  // make draggable
  grid.find('.grid-item').each((i, gridItem) => {
    const draggie = new Draggabilly(gridItem, {handle: 'h3'});
    grid.packery('bindDraggabillyEvents', draggie);
  });

  // save drag positions on event
  grid.on('dragItemPositioned', () => {
    // save drag positions
    const positions = grid.packery('getShiftPositions');
    Cookies.set('dragPositions', positions);
  });

  this.updateGrid = () => {
    grid.packery();
  };
})();

moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: '1s',
    ss: '%ss',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1M',
    MM: '%dM',
    y: '1Y',
    yy: '%dY',
  },
});

// Main data refresh loop every 60 minutes
function update() {
  getWorldState();
  setTimeout(update, 30000);
}

update();
updateTimeBadges(); // Method has its own 1 second timeout
updateResetTime(); // This should not be called again unless the timer expires
