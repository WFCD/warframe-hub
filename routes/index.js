// Routing page for pages on the root level

var express = require('express');
var ua = require('universal-analytics');
var visitor = ua('UA-47080716-6', {https: true});
var router = express.Router();

router.get('/', function (req, res) {
    visitor.pageview('/').send();
    res.render('index', {title: 'Index'});
});

router.get('/timer', function (req, res) {
    visitor.pageview('/timer').send();
    res.render('index', {title: 'Timers'});
});

router.get('/map', function (req, res) {
    visitor.pageview('/map').send();
    res.render('map', {title: 'Map'});
});

router.get('/fish', function (req, res) {
    visitor.pageview('/map').send();
    res.render('fish', {title: 'Fish'});
});

module.exports = router;