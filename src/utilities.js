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

export const wfcdn = (imgName) => `https://cdn.warframestat.us/img/${imgName}`;

export const optimize = (img, size) =>
  `https://cdn.warframestat.us/${size ? `rs_${size}_fit,` : ''}o_webp,progressive_true/${img}`;

export default {
  makeid,
  optimize,
  cdn,
};
