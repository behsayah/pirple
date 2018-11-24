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
const libTokens = require('../../../lib/token');
const libRegEx = require('../../../lib/regex');

// Main Container
const lib = function(data, callback) {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _users[data.method](data, callback);
  } else {
    callback(404);
  }
};

// Main Container for APIs
const _users = {};

_users.folder = 'users';

// Save a user
// Required data : data.
// Optional data : none.
// @TODO Only let an authenticated user access their object. Don't let them access anyone else.
_users.post = function(data, callback) {
  // console.log('Payload : ', data.payload);
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
  const address =
    typeof data.payload.address == 'string' &&
    data.payload.address.trim().length > 0
      ? data.payload.address.trim()
      : false;
  const password =
    typeof data.payload.password == 'string' &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  const email =
    typeof data.payload.email == 'string' &&
    data.payload.email.trim().length > 0
      ? data.payload.email.trim()
      : false;
  if (firstName && lastName && phone && password && email && address) {
    const _reg = RegExp(libRegEx.email());
    if (_reg.test(email)) {
      // Make sure the user doesn't already exist.
      _data.read(_users.folder, phone, function(err, data) {
        if (err) {
          // Hash the password
          const hashedPassword = helper.hash(password);
          if (hashedPassword) {
            const userObject = {
              firstName: firstName,
              lastName: lastName,
              phone: phone,
              hashedPassword: hashedPassword,
              address: address,
              email: email
            };

            _data.create(_users.folder, phone, userObject, function(err) {
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
          callback(400, {
            Error: 'A user with this phone number already exist'
          });
        }
      });
    } else {
      callback(400, { Error: 'The email address is not correct' });
    }
  } else {
    callback(400, { Error: 'Missing required fields' });
  }
};

// Required data : phone
// Optional data :  none
// @TODO Only let an authenticated user access their object. Dont let them access anyone elses.
_users.get = function(data, callback) {
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
    _data.read(_users.folder, phone, function(err, userData) {
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
_users.put = function(data, callback) {
  console.log('USER PUT');
  console.log('PHONE ===> ', data.payload);

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
  const address =
    typeof data.payload.address == 'string' &&
    data.payload.address.trim().length > 0
      ? data.payload.address.trim()
      : false;
  const email =
    typeof data.payload.email == 'string' &&
    data.payload.email.trim().length > 0
      ? data.payload.email.trim()
      : false;

  if (phone) {
    if (_reg.test(email)) {
      _data.read(_users.folder, phone, function(err, data) {
        if (!err && data) {
          if (firstName) data.firstName = firstName;
          if (lastName) data.lastName = lastName;
          if (password) data.hashedPassword = helper.hash(password);
          if (email) data.email = email;
          if (address) data.address = address;

          _data.update(_users.folder, phone, data, function(err) {
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
      callback(400, { Error: 'The email address is not correct' });
    }
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

// Required data : phone
// Optional data : none.
// Description : Delete a user.
_users.delete = function(data, callback) {
  const phone =
    typeof data.payload.phone == 'string' &&
    data.payload.phone.trim().length > 0
      ? data.payload.phone
      : false;
  if (phone) {
    // Get token from header.
    const token =
      typeof data.headers.token == 'string' ? data.headers.token : false;
    libTokens.verifyToken(token, phone, tokenIsValid => {
      if (tokenIsValid) {
        _data.read('users', phone, (err, data) => {
          console.log('Delete Error 1 =============== > ', err, data);
          if (!err && data) {
            _data.delete('users', phone, err => {
              console.log('Delete Error 2 =============== > ', err);
              if (!err) {
                callback(200);
              } else {
                callback(500, {
                  Error: 'Could not delete the specified user.'
                });
              }
            });
          } else {
            callback(400, { Error: 'Could not find the specific user.' });
          }
        });
      } else {
        callback(403, {
          Error: 'Missing required token in header, or invalid token'
        });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields.' });
  }
};

// Export The Module
module.exports = lib;
