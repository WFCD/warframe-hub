// Routing page for pages on the root level

var express = require('express');
var winston = require('winston');

var router = express.Router();

router.get('/', function (req, res) {
    winston.info('Received ' + req.method + ' request for ' + req.originalUrl + ' from ' + req.connection.remoteAddress);
    res.render('index', {title: 'Index'});
});

router.get('/timer', function (req, res) {
    winston.info('Received ' + req.method + ' request for ' + req.originalUrl + ' from ' + req.connection.remoteAddress);
    res.render('index', {title: 'Timers'});
});

router.get('/map', function (req, res) {
    winston.info('Received ' + req.method + ' request for ' + req.originalUrl + ' from ' + req.connection.remoteAddress);
    res.render('map', {title: 'Map'});
});

router.get('/fish', function (req, res) {
    winston.info('Received ' + req.method + ' request for ' + req.originalUrl + ' from ' + req.connection.remoteAddress);
    res.render('fish', {title: 'Fish'});
});

router.get('/howtofish', function (req, res) {
    winston.info('Received ' + req.method + ' request for ' + req.originalUrl + ' from ' + req.connection.remoteAddress);
    res.render('howtofish', {title: 'How to Fish'});
});

router.get('/404', function (req, res) {
    winston.info('Received ' + req.method + ' request for ' + req.originalUrl + ' from ' + req.connection.remoteAddress);
    res.render('404', {title: '404 Error'});
});

router.get('*', function (req, res) {
    winston.error('ABNORMAL ' + req.method + ' REQUEST for ' + req.originalUrl + ' from ' + req.connection.remoteAddress);
    res.render('404', {title: '404 Error'});
});

module.exports = router;