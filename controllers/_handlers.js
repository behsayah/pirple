/*
 * The main handler
 *
 * 
 * 
 */

// Dependencies (NodeJS)
// Dependencies (local)
const users = require('./api/users/users');
const pings = require('./api/pings/pings');
const token = require('./api/tokens/token');

// The main container
const handlers = {};

handlers.ping = (data, callback) => {
  callback(200);
};
handlers.notFound = (data, callback) => {
  callback(404);
};
handlers.hello = (data, callback) => {
  callback(403, { Message: 'Welcome to the first RESTful application' });
};
handlers.users = users;
module.exports = handlers;
