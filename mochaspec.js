// We'll use this to override require calls in routes
var proxyquire = require('proxyquire');
// Supertest allows us to make requests against an express object
var supertest = require('supertest');
// Natural language-like assertions
var expect = require('chai').expect;

var express = require('express');

describe('GET /ping', function () {
  var app, request, route;

  beforeEach(function () {

    // Create an express application object
    app = express();

    // Get our router module, with a stubbed out users dependency
    // we stub this out so we can control the results returned by
    // the users module to ensure we execute all paths in our code
    route = proxyquire('./routes/index.js');

    // Bind a route to our application
    route(app);

    // Get a supertest instance so we can make requests
    request = supertest(app);
  });

  it('should respond with 200', function (done) {
    request
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, function (err, res) {
        done();
      });
  });
});