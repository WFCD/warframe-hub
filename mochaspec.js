const request = require('supertest');
const path = require('path');
const favicon = require('serve-favicon');
const express = require('express');
const handlebars = require('express-handlebars');

const app = express();
const router = require('./routes/index');

app.use(router);

const hbs = handlebars.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
    json:  function(context) { return JSON.stringify(context); },
  },
  defaultLayout: 'main',
  extname: '.hbs',
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

describe('GET /', () => {
  it('respond with 200', done => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err && res !== null) {
          return done(err);
        }
        return done();
      });
  });
});

describe('GET /map', () => {
  it('respond with 200', done => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err && res !== null) {
          return done(err);
        }
        return done();
      });
  });
});
