/*
 * Handle Favicon Request
 *
 * 
 */

// Dependencies (NodeJS)
// Dependencies (Localhost)

// Main Container
const lib = (data, callback) => {
  const acceptableMethod = ['get'];
  if (acceptableMethod.indexOf(data.method) > -1) {
    _favicon[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Main Handler Container
const _favicon = {};

// Return FavIcon
_favicon.get = function(data, callback) {
  _favicon.getStaticAsset('favicon.ico', (err, data) => {
    if ((!err, data)) {
      // Read in the favicon's data
      callback(200, data, 'favicon');
    } else {
      callback(500);
    }
  });
};

// Export Module
module.exports = lib;
