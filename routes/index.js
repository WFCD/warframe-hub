// Routing page for pages on the root level

const express = require('express');
const winston = require('winston');

const router = express.Router();

const trackables = require('../assets/json/trackables.json');
const planets = require('../assets/json/planets.json');
const components = require('../assets/json/components.json');
const sums = require('../public/sums.json'); // eslint-disable-line import/no-unresolved

winston.level = process.env.LOG_LEVEL || 'error'; // default to error, we don't need everything

router.get('/', (req, res) => {
  winston.info(`Received ${req.method} request for ${req.originalUrl} from ${req.connection.remoteAddress}`);
  res.render('index', {title: 'Index', trackables, planets, components, sums});
});

router.get('/timer', (req, res) => {
  winston.info(`Received ${req.method} request for ${req.originalUrl} from ${req.connection.remoteAddress}`);
  res.render('index', {title: 'Timers', trackables, planets, components, sums});
});

router.get('/map', (req, res) => {
  winston.info(`Received ${req.method} request for ${req.originalUrl} from ${req.connection.remoteAddress}`);
  res.render('map', {title: 'Map', sums});
});

router.get('/fish', (req, res) => {
  winston.info(`Received ${req.method} request for ${req.originalUrl} from ${req.connection.remoteAddress}`);
  res.render('fish', {title: 'Fish', sums});
});

router.get('/howtofish', (req, res) => {
  winston.info(`Received ${req.method} request for ${req.originalUrl} from ${req.connection.remoteAddress}`);
  res.render('howtofish', {title: 'How to Fish', sums});
});

router.get('/404', (req, res) => {
  winston.info(`Received ${req.method} request for ${req.originalUrl} from ${req.connection.remoteAddress}`);
  res.render('404', {title: '404 Error', sums});
});

router.get('*', (req, res) => {
  winston.error(`ABNORMAL ${req.method} REQUEST for ${req.originalUrl} from ${req.connection.remoteAddress}`);
  res.render('404', {title: '404 Error', sums});
});

module.exports = router;
