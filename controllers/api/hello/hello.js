/*
 *
 * Handle requiest for hello URI.
 *
 *
 *
 */

// Dependencies (NodeJS)
const os = require('os');
const cluster = require('cluster');
// Dependencies (Localhost)

// Main Container
const lib = function(data, callback) {
  if (cluster.isMaster) {
    for (let i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
  } else {
    const acceptableMethod = ['get'];
    if (acceptableMethod.indexOf(data.method) > -1) {
      _hello[data.method](data, callback);
    } else {
      callback(404);
    }
  }
};

// Hello Container
const _hello = {};

// Required data: none
// Optional data: none.
// Description: Reply just a sentence when we will get a requires.
_hello.get = (data, callback) => {
  callback(200, { msg: 'Welcome to the first RESTful application' });
};
// Exports Module
module.exports = lib;
