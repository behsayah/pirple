/*
 * Helpers for various tasks
 *
 * 
 * 
 */

// Dependencies (Node JS)
const crypto = require('crypto');
// Dependencies (Localhost)
const config = require('./config');

// Main Container
const helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str) {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (err) {
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function(str) {
  if (typeof str == 'string' && str.length > 0) {
    const hash = crypto
      .createHmac('sha256', config.hashingSecret)
      .update(str)
      .digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Export The Module
module.exports = helpers;
