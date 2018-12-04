/*
 * Primary file for API
 *
 */

// Dependencies (NodeJS)
const os = require('os');
const cluster = require('cluster');
// Dependencies (Localhost)
var server = require('./.config/server');
var workers = require('./lib/workers');
const cli = require('./lib/cli/cli');
const _tty = require('./lib/apis/screen');

// Declare the app
var app = {};

// Init function
app.init = function() {
  server.init();

  setTimeout(() => {
    cli.init();
  }, 50);

  // if (cluster.isMaster) {
  //   // Start the workers
  //   // workers.init();

  //   // Start the CLI, but make sure it starts last.
  //   setTimeout(() => {
  //     cli.init();
  //   }, 50);

  //   for (let i = 0; i < os.cpus().length; i++) {
  //     cluster.fork();
  //   }
  // } else {
  //   // Start the server
  //   server.init();
  //   _tty.screenSize();
  // }
};

// Self executing
if (require.main === module) {
  app.init();
}

// Export the app
module.exports = app;
