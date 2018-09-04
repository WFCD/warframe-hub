// Routing page for pages on the root level

const express = require('express');
const {transports, createLogger, format} = require('winston');

const {
  combine, label, printf, colorize,
} = format;

const transport = new transports.Console({colorize: true});
const logFormat = printf(info => `[${info.label}] ${info.level}: ${info.message}`);

const logger = createLogger({
  format: combine(colorize(), label({label: 'Tenno.tv'}), logFormat),
  transports: [transport],
});

const router = express.Router();

const trackables = require('../assets/json/trackables.json');
const planets = require('../assets/json/planets.json');
const components = require('../assets/json/components.json');
const fishes = require('../assets/json/fish.json');
const sums = require('../public/sums.json'); // eslint-disable-line import/no-unresolved

logger.level = process.env.LOG_LEVEL || 'error'; // default to error, we don't need everything

router.get('/', (req, res) => {
  logger.info(`Received ${req.method} request for ${req.originalUrl} from ${req.connection.remoteAddress}`);
  res.render('index', {
    title: 'Index', trackables, planets, components, sums,
  });
});

router.get('/timer', (req, res) => {
  logger.info(`Received ${req.method} request for ${req.originalUrl} from ${req.connection.remoteAddress}`);
  res.render('index', {
    title: 'Timers', trackables, planets, components, sums,
  });
});

router.get('/map', (req, res) => {
  logger.info(`Received ${req.method} request for ${req.originalUrl} from ${req.connection.remoteAddress}`);
  res.render('map', {title: 'Map', sums});
});

router.get('/fish', (req, res) => {
  logger.info(`Received ${req.method} request for ${req.originalUrl} from ${req.connection.remoteAddress}`);
  res.render('fish', {title: 'Fish', sums, fishes});
});

router.get('/howtofish', (req, res) => {
  logger.info(`Received ${req.method} request for ${req.originalUrl} from ${req.connection.remoteAddress}`);
  res.render('howtofish', {title: 'How to Fish', sums});
});

router.get('/404', (req, res) => {
  logger.info(`Received ${req.method} request for ${req.originalUrl} from ${req.connection.remoteAddress}`);
  res.render('404', {title: '404 Error', sums});
});

router.get('*', (req, res) => {
  logger.error(`ABNORMAL ${req.method} REQUEST for ${req.originalUrl} from ${req.connection.remoteAddress}`);
  res.render('404', {title: '404 Error', sums});
});

module.exports = router;
