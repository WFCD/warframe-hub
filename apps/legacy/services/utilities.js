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

export const optimize = (img, size, mode, direction) => {
  const fsize = size ? `rs_${size}_${mode || 'fit'}_${direction || 'auto'},` : '';
  return `https://cdn.warframestat.us/${fsize}o_webp,progressive_true/${img}`;
};

export const get = async (url, opts) => {
  try {
    return await fetch(url, opts).then((d) => d.json());
  } catch (ignored) {}
};

export default {
  makeid,
  optimize,
  cdn,
  get,
};
