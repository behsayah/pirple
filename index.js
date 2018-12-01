/*
 * Primary file for API
 *
 */

// Dependencies
var server = require('./.config/server');
var workers = require('./.config/workers');
const cli = require('./lib/cli/cli');

// Declare the app
var app = {};

// Init function
app.init = function() {
  // Start the server
  server.init();

  // Start the workers
  // workers.init();

  // Start the CLI, but make sure it starts last.
  setTimeout(() => {
    cli.init();
  }, 50);
};

// Self executing
app.init();

// Export the app
module.exports = app;
