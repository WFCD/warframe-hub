// Routing page for pages on the root level

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {title: 'Index'});
});

router.get('/timer', function (req, res) {
    res.render('index', {title: 'Timers'});
});

router.get('/map', function (req, res) {
    res.render('map', {title: 'Map'});
});

router.get('/fish', function (req, res) {
    res.render('fish', {title: 'Fish'});
});

router.get('/howtofish', function (req, res) {
    res.render('howtofish', {title: 'How to Fish'});
});

module.exports = router;