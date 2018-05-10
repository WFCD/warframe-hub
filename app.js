const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

const app = express();
const router = require('./routes/index');

const hbs = handlebars.create({helpers: {json: JSON.stringify}, defaultLayout: 'main', extname: '.hbs'});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// favicon and caching options (cache is 7 days)
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 604800000}));

// default node js includes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// dev logger that should not be used in prod

app.use(router);

module.exports = app;
