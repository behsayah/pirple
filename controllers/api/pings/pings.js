/*
 * Handle ping requests
 *
 * 
 */

// Dependencies (NodeJS)
// Dependencies (Localhost)

// Main Container
const lib = function(data, callback) {
  const acceptableMethod = ['get'];
  if (acceptableMethod.indexOf(data.method) > -1) {
    _ping[data.method](data, callback);
  } else {
    callback(404);
  }
};

// Ping Container
const _ping = {};
// Required data : none.
// Optional data : none.
// Description: It respons to GET require.
_ping.get = function(data, callback) {
  callback(200, { msg: 'The server is up and running' });
};

// Export Module
module.exports = lib;
