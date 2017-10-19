// Routing page for pages on the root level

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/cetus', function (req, res) {
    res.render('index');
});

router.get('/map', function (req, res) {
    res.render('map');
});

module.exports = router;