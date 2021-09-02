'use strict';

export const makeid = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export const cdn = (path) => `https://cdn.warframestat.us/genesis/${path}`;

export const optimize = (img) => `https://cdn.warframestat.us/o_webp,progressive_true/${img}`;

export default {
  makeid,
  optimize,
  cdn,
};
