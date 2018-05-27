/* eslint-disable no-unused-vars */
/* globals $, moment, Cookies, localStorage, Notification,
  loadFilterData, sendNotification, formatDurationShort,
  formatTimer, getWorldState, worldState, selectPlatform,
  updatePlatformSwitch, platformSwapped, updateCetusCycle,
  updateEarthCycle, updateResetTime, TypeIt
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
  const notifiedIds = JSON.parse(localStorage.getItem('notifiedIds') || '[]');
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
      currentLabel.html(`Starts in: ${formatDurationShort(durationactivate)}`);
    } else if (diff < 0) { // Expired
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
          currentLabel.parents()[0].remove();
        }
      }
    } else {
      currentLabel.html(`Time left: ${formatTimer(diff)}`);
    }
  }

  setTimeout(updateTimeBadges, 1000);
}

// Moving background
$(document).ready(() => {
  const movementStrength = 4;
  const height = movementStrength / $(window).height();
  const width = movementStrength / $(window).width();
  $('#content').mousemove(e => {
    const pageX = e.pageX - ($(window).width() / 2);
    const pageY = e.pageY - ($(window).height() / 2);
    const newvalueX = (width * pageX * -1) - 4;
    const newvalueY = (height * pageY * -1) - 8;
    $('#content').css('background-position', `${newvalueX}vw     ${newvalueY}vh`);
  });

  // Section switcher
  $('.sections li').click(() => {
    const requestedSection = $(this).attr('id');
    const sectionTitle = $(this).attr('name');
    $('.sections > li').removeClass('active');
    $(this).addClass('active');
    $('.sectionTitle').html(sectionTitle);

    new TypeIt('.sectionTitle', {
      cursor: false,
      speed: 20,
      autoStart: true,
    });

    $('.section').hide();
    $(`#${requestedSection}Wrapper`).show();
  });

  // Default section
  $('#alerts').click();

  // Dropdown
  $('.dropdown').click(() => {
    $(this).find('.dropdownList').slideToggle('fast');
  });
});

$(document).on('click', event => {
  const $trigger = $('.dropdown');
  if ($trigger !== event.target && !$trigger.has(event.target).length) {
    $('.dropdownList').slideUp('fast');
  }
});

$(document).on('click', event => {
  const $trigger = $('.dropdown');
  if ($trigger !== event.target && !$trigger.has(event.target).length) {
    $('.dropdownList').slideUp('fast');
  }
});

// Set default platform to PC if there isn't one
if (typeof Cookies.get('platform') === 'undefined') {
  Cookies.set('platform', 'pc', {expires: 365});
}
selectPlatform(Cookies.get('platform'));

// Platform switcher
$('.platform-picker li').click(e => {
  const platform = $(e.currentTarget).attr('data-platform');
  selectPlatform(platform);
  Cookies.set('platform', platform, {expires: 365});
  platformSwapped = true; // eslint-disable-line no-global-assign
  getWorldState();
  setTimeout(updatePlatformSwitch, 30000);
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

// Main data refresh loop every 60 minutes
function update() {
  getWorldState();
  setTimeout(update, 30000);
}

update();
updateTimeBadges(); // Method has its own 1 second timeout
updateResetTime(); // This should not be called again unless the timer expires
setInterval(cleanupNotifiedIds, 60000);
