'use strict';

import fetch from 'node-fetch';

export const makeid = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export const cdn = (path) => `https://cdn.warframestat.us/genesis/${path}`;

export const wfcdn = (imgName) => `https://cdn.warframestat.us/img/${imgName}`;

export const optimize = (img, size, mode, direction) =>
  `https://cdn.warframestat.us/${
    size ? `rs_${size}_${mode || 'fit'}_${direction || 'auto'},` : ''
  }o_webp,progressive_true/${img}`;

export const get = async (url, opts) => {
  try {
    return fetch(url, opts).then((d) => d.json());
    // eslint-disable-next-line no-empty
  } catch (ignored) {}
};

export default {
  makeid,
  optimize,
  cdn,
  get,
};
