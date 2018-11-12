/*
 * Validate a token
 *
 * 
 * 
 */

// Dependencies (NodeJS)
// Dependencies (localhost)
const _data = require('./data');

// Main Container
const lib = {};

// Validate a token
lib.verifyToken = function(id, phone, callback) {
  // Lookup the token
  _data.read('tokens', id, (err, data) => {
    console.log('ERROR ===================== >', err);
    console.log('DATA ===================== >', data);
    if (!err && data) {
      if (data.phone == phone && data.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};
// Export module
module.exports = lib;
