'use strict';

const express = require('express');
const serveStatic = require('serve-static');
const app = express();
app.use(serveStatic(__dirname + '/dist'));
var port = process.env.PORT || 3000;
app.listen(port);
