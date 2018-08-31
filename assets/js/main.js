/* eslint-disable no-unused-vars */
/* globals $, moment, Cookies, Draggabilly, Packery, updateGrid,
  localStorage, Notification, loadFilterData, sendNotification,
  formatDurationShort, formatTimer, getWorldState, worldState,
  selectPlatform, updatePlatformSwitch, platformSwapped,
  updateCetusCycle, updateEarthCycle, updateResetTime
*/
/* eslint-enable no-unused-vars */
const cleanupNotifiedIds = () => {
  if (!worldState) return;
  const ids = worldState.alerts.map(alert => alert.id)
    .concat(worldState.invasions.map(invasion => invasion.id))
    .concat(worldState.news.map(item => item.id))
    .concat(worldState.events.map(event => event.id))
    .concat([worldState.sortie.id])
    .concat(worldState.syndicateMissions.map(item => item.id))
    .concat(worldState.fissures.map(item => item.id))
    .concat(worldState.dailyDeals.map(deal => deal.id))
    .concat(worldState.flashSales.map(item => item.id))
    .concat(worldState.conclaveChallenges.map(item => item.id))
    .concat(worldState.conclaveChallenges.map(item => item.id))
    .concat([worldState.cetusCycle.id])
    .concat([worldState.voidTrader.id])
    .concat(worldState.persistentEnemies.map(enemy => enemy.pid));
  const notifiedIds = JSON.parse(localStorage.notifiedIds || '[]');
  const toRemove = [];
  notifiedIds.forEach(id => {
    if (!ids.includes(id)) {
      toRemove.push(id);
    }
  });
  toRemove.forEach(id => {
    notifiedIds.splice(notifiedIds.indexOf(id), 1);
  });

  localStorage.setItem('notifiedIds', JSON.stringify(notifiedIds));
};

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
    if (!label.hasAttribute('data-endtime')) {
      // Increasing timer
      currentLabel.text(`${diffactivate > 0 ? '-' : ''}${formatTimer(Math.abs(diffactivate))}`);
    } else if (typeof diffactivate !== 'undefined' && diffactivate > 0) {
      // Not started
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
      } else if (diff > 1800000) { // 30 min to 1 hour
        color = 'label-success';
      }

      if (!currentLabel.hasClass(color)) {
        removeTimeBadgeColor(currentLabel);
        currentLabel.addClass(color);
      }
      currentLabel.html(formatTimer(diff));
    }
  }

  setTimeout(updateTimeBadges, 1000);
}

// Set default platform to PC if there isn't one
if (typeof localStorage.platform === 'undefined') {
  localStorage.platform = 'pc';
}
selectPlatform(localStorage.platform);

// Platform switcher
$('.platform-picker li').click(e => {
  const platform = $(e.currentTarget).attr('data-platform');
  selectPlatform(platform);
  localStorage.platform = platform;
  platformSwapped = true; // eslint-disable-line no-global-assign
  getWorldState();
  setTimeout(updatePlatformSwitch, 30000);
});

// Set default component selections if there aren't any
[['event'], ['acolytes'], ['cetus'], ['earth'], ['bounties'], ['alerts'],
  ['news'], ['invasions'], ['reset'], ['sortie'], ['fissures'],
  ['baro'], ['darvo'], ['deals', 'false']].forEach(([component, defValue]) => {
  let value = localStorage.getItem(component);
  if (typeof value === 'undefined') {
    if (typeof defValue === 'undefined') {
      value = 'true';
    } else {
      value = defValue;
    }
    localStorage.setItem(component, value);
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

  Cookies.set(component, status, {expires: 365});
  if (status) {
    componentElement.show();
  } else {
    componentElement.hide();
  }
  updateGrid();
});

loadFilterData();

$('#notif-anchor').click(() => {
  if (!('Notification' in window)) {
    // eslint-disable-next-line no-console
    console.error('[Error] This browser does not support system notifications');
  } else if (Notification.permission === 'granted') {
    // Do nothing
  } else if (Notification.permission !== 'denied') {
    // Otherwise, we need to ask the user for permission
    Notification.requestPermission(permission => {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        sendNotification('Woot, now we can send you notifications.');
      }
    });
  }
});

const checkAndToggleValue = (setting, dataName, e) => {
  const filterData = JSON.parse(localStorage.getItem(setting) || '[]');
  const target = $(e.target);
  const status = target.prop('checked');
  const filter = target.attr(`data-${dataName}`);

  if (status) {
    if (!filterData.includes(filter)) {
      filterData.push(filter);
    }
  } else if (filterData.includes(filter)) {
    filterData.splice(filterData.indexOf(filter), 1);
  }
  const stringified = JSON.stringify(filterData);
  localStorage.setItem(setting, stringified);
};

// Toggle filter settings on checkbox click
$('.notif-filter-check').click(e => {
  checkAndToggleValue('notificationfilters', 'notif', e);
});

const reloadAfterClick = () => {
  platformSwapped = true; // eslint-disable-line no-global-assign
  getWorldState();
  setTimeout(updatePlatformSwitch, 30000);
};

$('.fissure-filter-check').click(e => {
  checkAndToggleValue('fissurefilters', 'fissure', e);
  reloadAfterClick();
});

$('.sound-option-check').click(e => {
  checkAndToggleValue('soundoptions', 'sound', e);
});

// Show dropdowns that should be visible only on timers page
$('.platform-picker').removeClass('hide');
$('#component-selector').removeClass('hide');
$('#filters-picker').removeClass('hide');

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
    Cookies.set('dragPositions', positions, {expires: 365});
  });

  this.updateGrid = () => {
    grid.packery();
  };
})();

moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
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

/* Polyfills go here */
/* eslint-disable */
// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength >>= 0; // truncate if number or convert non-number to 0;
    padString = String((typeof padString !== 'undefined' ? padString : ' '));
    if (this.length > targetLength) {
      return String(this);
    }

    targetLength -= this.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer than needed
    }
    return padString.slice(0, targetLength) + String(this);
  };
}
/* eslint-enable */

// Main data refresh loop
function initializeUpdateLoop() {
  const updatePeriod = 60000;
  let nextUpdateTimestamp = 0;
  (function updateCheck() {
    const currentTimestamp = new Date().getTime();
    if (currentTimestamp >= nextUpdateTimestamp) {
      getWorldState();
      nextUpdateTimestamp = currentTimestamp + updatePeriod;
    }
    setTimeout(updateCheck, 3000);
  }());
}

initializeUpdateLoop();
updateTimeBadges(); // Method has its own 1 second timeout
updateResetTime(); // This should not be called again unless the timer expires
setInterval(cleanupNotifiedIds, 60000);
