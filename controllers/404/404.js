/*
 * Hanlde 404 Request
 *
 * 
 */

// Dependencies (NodeJS)
// Dependencies (Localhost)

// Main Container
const lib = (data, callback) => {
  const acceptableMethod = ['get'];
  if (acceptableMethod.indexOf(data.method) > -1) {
    _notFound[data.method](data, callback);
  } else {
    callback(405, undefined, 'html');
  }
};

// Main 404 Container
const _notFound = {};

// Required Data :
// Optional Data :
// Description: If we could not find a page we will response it with this.
_notFound.get = (data, callback) => {
  callback(405, undefined, 'html');
};

// Export Module
module.exports = lib;
