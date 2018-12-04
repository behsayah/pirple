/*
 * Helpers for various tasks
 *
 *
 *
 */

// Dependencies (Node JS)
const crypto = require('crypto');
// Dependencies (Localhost)
const config = require('./../.config/config');

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
helpers.createRandomString = function(length) {
  length = typeof length == 'number' && length > 0 ? length : false;
  if (length) {
    const possibleCharacter = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let index = 0; index < length; index++) {
      const randomCharacter = possibleCharacter.charAt(
        Math.random() * possibleCharacter.length
      );
      str += randomCharacter;
    }
    return str;
  } else {
    return false;
  }
};

// Export The Module
module.exports = helpers;
