/*
 * The main handler
 *
 * 
 * 
 */

// Dependencies (NodeJS)
// Dependencies (local)
const users = require('./api/users/users');

// The main container
const handlers = {};

handlers.ping = (data, callback) => {
  callback(200);
};
handlers.notFound = (data, callback) => {
  callback(404);
};
handlers.hello = (data, callback) => {
  callback(200, { msg: 'Welcome to the first RESTful application' });
};
handlers.users = users;
module.exports = handlers;
