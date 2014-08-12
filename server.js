'use strict';

var express = require('express');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

var app = express();

// Express settings
require('./lib/config/express')(app);

// Socket.IO settings
var socket = require('./lib/config/socket')(app);

require('./lib/ssh-copy-id')(socket.io);
require('./lib/node-directory-tree')(socket.io);

// Routing
require('./lib/routes')(app, socket.io);

// Start server
socket.server.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
