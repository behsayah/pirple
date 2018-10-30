/*
 * The main handler
 *
 * 
 * 
 */

// Dependencies (NodeJS)
// Dependencies (local)

// The main container
const handlers = {};

handlers.sample = (data, callback) => {
  callback(200, { name: 'sample handler' });
};
handlers.notFound = (data, callback) => {
  callback(404);
};

module.exports = handlers;
