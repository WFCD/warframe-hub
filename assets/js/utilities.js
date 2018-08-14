/* globals $, localStorage, Notification */
/* eslint-disable no-unused-vars */

function calculateInventory(total, sold) {
  return `${total - sold}/${total}`;
}

// load filter settings
const loadNotificationFilterData = () => {
  const filterData = JSON.parse(localStorage.getItem('notificationfilters') || '[]');
  filterData.forEach(filter => {
    $(`.notif-filter-check[data-notif="${filter}"]`)
      .prop('checked', true);
  });
};

const loadFissuresFilterData = () => {
  const filterData = JSON.parse(localStorage.getItem('fissurefilters') || '[]');
  filterData.forEach(filter => {
    $(`.fissure-filter-check[data-fissure="${filter}"]`)
      .prop('checked', true);
  });
};

const loadSoundOptionsData = () => {
  const filterData = JSON.parse(localStorage.getItem('soundoptions') || '[]');
  filterData.forEach(filter => {
    $(`.sound-option-check[data-sound="${filter}"]`)
      .prop('checked', true);
  });
};

const loadFilterData = () => {
  loadNotificationFilterData();
  loadFissuresFilterData();
  loadSoundOptionsData();
};

const sendNotification = (body, title = 'Warframe Hub', sound, link) => {
  if (Notification.permission === 'granted') {
    const notif = new Notification(title, {icon: 'https://warframestat.us/wfcd_logo_color.png', body});
    setTimeout(notif.close.bind(notif), 15000);
    if (sound) {
      const audio = new Audio(sound);
      audio.volume = 0.2;
      audio.play();
    }
    notif.onclick = event => {
      if (link) {
        event.preventDefault();
        window.open(link, '_blank');
      } else {
        window.focus();
      }
      notif.close.bind(notif);
    };
    return notif;
  }
  return undefined;
};

const isNotNotified = id => {
  const notifiedIds = JSON.parse(localStorage.getItem('notifiedIds') || '[]');
  return !notifiedIds.includes(id);
};

const addNotifiedId = id => {
  const notifiedIds = JSON.parse(localStorage.getItem('notifiedIds') || '[]');
  notifiedIds.push(id);
  localStorage.setItem('notifiedIds', JSON.stringify(notifiedIds));
};

const isNotifiable = (id, event, items) => {
  const tracked = JSON.parse(localStorage.getItem('notificationfilters') || '[]');
  const includesItems = (typeof items !== 'undefined' && items.length > 0) ? tracked.some(r => items.indexOf(r) >= 0) : true;
  return isNotNotified(id) && tracked.includes(event) && (includesItems);
};

const fissureGlyphs = ['https://i.imgur.com/D595KoY.png', 'https://i.imgur.com/VpBDaZV.png', 'https://i.imgur.com/YOjBckN.png', 'https://i.imgur.com/nZ3FfpC.png'];

const getImage = (
  type,
  {
    className = undefined, image = undefined, title = undefined, forcePng = false,
  },
) => {
  if (typeof SVGRect !== 'undefined' && !forcePng) {
    return `<img src="img/${type}/${image}.svg" class="${className} inv" title="${title}" alt="${image}" />`;
  } else if (type === 'fissure') {
    return `<img src="${fissureGlyphs[parseInt(image, 10) - 1]}" class="${className}" title="${title}" alt="${image}" />`;
  } else if (type === 'archwing') {
    return `<img src="https://i.imgur.com/R1kpRx4.png" class="${className}" title="${title}" alt="${title}" />`;
  } else if (type === 'nightmare') {
    return `<img src="https://i.imgur.com/x5XoktW.png" class="${className}" title="${title}" alt="${title}" />`;
  }
  return `<img src="img/${type}/${image}.png" class="${className}" alt="${image}" />`;
};

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

/* helper function, transforms miliseconds diff into one of:
Dd HHh MMm SSs
Hh MMm SSs
Mm SSs
Ss */
function formatTimer(diff) {
  let timeLeft = diff;
  const stringArray = [];

  [[86400000, 'd'], [3600000, 'h'], [60000, 'm'], [1000, 's']]
    .forEach(([unit, suffix]) => {
      const time = Math.floor(timeLeft / unit);
      const first = stringArray.length === 0;
      if (!first || time > 0) {
        stringArray.push(time.toString()
          .padStart(first ? 1 : 2, '0') + suffix);
      }
      timeLeft -= time * unit;
    });
  return stringArray.join(' ');
}

// Helper function to grab objects based on inner tags
function getObjects(obj, key, val) {
  let objects = [];
  if (obj && typeof obj !== 'undefined') {
    for (const objKey of Object.keys(obj)) {
      if (objKey && typeof obj[objKey] === 'object') {
        objects = objects.concat(getObjects(obj[objKey], key, val));
      } else if (objKey === key && obj[objKey] === val) {
        objects.push(obj);
      }
    }
  }
  return objects;
}

// Change color of active platform
function selectPlatform(platform) {
  const cls = 'list-group-item-success';
  $('.platform-picker li')
    .removeClass(cls)
    .filter(`[data-platform="${platform}"]`)
    .addClass(cls);
}
/* eslint-enable no-unused-vars */
