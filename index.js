/*
 * Primary file for API
 *
 */

// Dependencies
var server = require('./.config/server');
var workers = require('./.config/workers');

// Declare the app
var app = {};

// Init function
app.init = function() {
  // Start the server
  server.init();

  // Start the workers
  // workers.init();
};

// Self executing
app.init();

// Export the app
module.exports = app;
