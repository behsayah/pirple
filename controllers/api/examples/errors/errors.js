/*
 * Errro Generator Module
 *
 *
 */

// Dependencies (NodeJS)
// Dependencies (Localhost)

// Main Container
const lib = (data, callback) => {
  console.log('TEST');
  const acceptableMethod = ['get'];
  if (acceptableMethod.indexOf(data.method) > -1) {
    _error[data.method](data, callback);
  } else {
    callback(404);
  }
};

// Functionality Container
const _error = {};

// Required Data: none.
// Optional Data: none.
// Description : Error generator
_error.get = (data, callback) => {
  const e = new Error('This is an example error');
  throw e;
};

// Export Module
module.exports = lib;
