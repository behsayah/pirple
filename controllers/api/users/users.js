/*
 * Users Main 
 *
 * 
 * 
 */

// Dependencies (Node JS)
// Dependencies (Localhost)
const _data = require('../../../lib/data');
const helper = require('../../../lib/helper');

// Main Container
const lib = function(data, callback) {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _user[data.method](data, callback);
  } else {
    callback(404);
  }
};

// Main Container for APIs
const _user = {};

_user.folder = 'users';

// Save a user
_user.post = function(data, callback) {
  console.log('USER POST');
  console.log('Payload : ', data.payload);
  // Validate data
  const firstName =
    typeof data.payload.firstName === 'string' &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName == 'string' &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const phone =
    typeof data.payload.phone == 'string' &&
    data.payload.phone.trim().length > 0
      ? data.payload.phone.trim()
      : false;
  const password =
    typeof data.payload.password == 'string' &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  console.log('firstName', firstName);
  console.log('lastName', lastName);
  console.log('PHONE', phone);
  console.log('password', password);
  if (firstName && lastName && phone && password) {
    // Make sure the user doesn't already exist.
    _data.read(_user.folder, phone, function(err, data) {
      if (err) {
        // Hash the password
        const hashedPassword = helper.hash(password);
        if (hashedPassword) {
          const userObject = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            hashedPassword: password
          };

          _data.create(_user.folder, phone, userObject, function(err) {
            if (!err) {
              callback(200);
            } else {
              callback(500, { Error: 'Could not create the new user.' });
            }
          });
        } else {
          callback(500, { Error: "Could not hash the user's password." });
        }
      } else {
        callback(400, { Error: 'A user with this phone number already exist' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields' });
  }
};

// Required data : phone
// Optional data :  none
// @TODO Only let an authenticated user access their object. Dont let them access anyone elses.
_user.get = function(data, callback) {
  console.log('USER GET');
  // Validate required data.
  const phone =
    typeof data.queryStringObject.phone == 'string' &&
    data.queryStringObject.phone.trim().length > 0
      ? data.queryStringObject.phone.trim()
      : false;
  console.log('PHONE =====> ', phone);
  if (phone) {
    // Lookup the user
    _data.read(_user.folder, phone, function(err, userData) {
      console.log(userData);
      if (!err && userData) {
        delete userData.hashedPassword;
        callback(200, userData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

// Required data : phone
// Optional data : firstName, lastName, password (at least one must be specified)
// @TODO Only let an authenticated user up their object. Dont let them access update elses.
_user.put = function(data, callback) {
  console.log('USER PUT');

  // Check for required field
  const phone =
    typeof data.payload.phone == 'string' &&
    data.payload.phone.trim().length > 0
      ? data.payload.phone.trim()
      : false;
  // Check for optional field
  const firstName =
    typeof data.payload.firstName == 'string' &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName == 'string' &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const password =
    typeof data.payload.password == 'string' &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  if (phone) {
    _data.read(_user.folder, phon, function(err, data) {
      if (!err && data) {
        if (firstName) data.firstName = firstName;
        if (lastName) data.lastName = lastName;
        if (password) data.hashedPassword = helper.hash(password);

        _data.update(_user.folder, phone, data, function(err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: 'Could not update the user.' });
          }
        });
      } else {
        callback(400, { Error: 'Specified user does not exist.' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

// Export The Module
module.exports = lib;
