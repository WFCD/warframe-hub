// Routing page for pages on the root level

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {title: "Hub"});
});

router.get('/timer', function (req, res) {
    res.render('index', {title: "Hub"});
});

router.get('/map', function (req, res) {
    res.render('map', {title: "Map"});
});

module.exports = router;