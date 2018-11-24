/*
 * Handle Token
 *
 *
 *
 */

// Dependencies (Node JS)
// Dependencies (Localhost)
const _data = require('../../../lib/data');
const hellpers = require('../../../lib/helper');

// Main Container
const lib = (data, callback) => {
  const acceptanceMethod = ['post', 'get', 'put', 'delete'];
  if (acceptanceMethod.indexOf(data.method) > -1) {
    _toknes[data.method](data, callback);
  } else {
    callback(404);
  }
};

// Main Functionality Container
const _toknes = {};

// Folder
_toknes.folder = 'tokens';
_toknes.userFolder = 'users';
// Tokens - post
// Required Data : phone, password
// Optional Data : none
_toknes.post = (data, callback) => {
  const phone =
    typeof data.payload.phone == 'string' &&
    data.payload.phone.trim().length > 0
      ? data.payload.phone
      : false;
  const password =
    typeof data.payload.password == 'string' &&
    data.payload.password.trim().length > 0
      ? data.payload.password
      : false;
  if (phone && password) {
    _data.read(_toknes.userFolder, phone, function(err, data) {
      if (!err && data) {
        const hashedPassword = hellpers.hash(password);
        if (hashedPassword === data.hashedPassword) {
          const tokenId = hellpers.createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60 * 24;
          const tokenObject = {
            phone: phone,
            id: tokenId,
            expires: expires
          };
          _data.create(_toknes.folder, tokenId, tokenObject, function(err) {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: 'Could not crete the new token' });
            }
          });
        } else {
          callback(400, { Error: 'The password is wrong.' });
        }
      } else {
        console.log('PHONE : ', phone);
        console.log('PASSWORD : ', password);
        callback(400, { Error: 'Could not find specified user' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required field(s)' });
  }
};

// Token - get
// Required Data : id
// Optional Data : none
_toknes.get = (data, callback) => {
  const id =
    typeof data.queryStringObject.id == 'string' &&
    data.queryStringObject.id.trim().length > 0
      ? data.queryStringObject.id
      : false;
  if (id) {
    _data.read(_toknes.folder, id, function(err, tokenInfo) {
      if (!err && tokenInfo) {
        callback(200, tokenInfo);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: 'Missing required field or field invalid.' });
  }
};

// Token - put
// Required Data : id, extend
// Optional Data : none
_toknes.put = (data, callback) => {
  const id =
    typeof data.queryStringObject.id == 'string' &&
    data.queryStringObject.id.trim().length > 0
      ? data.queryStringObject.id
      : false;
  const extend =
    typeof data.payload.extend == 'boolean' && data.payload.extend
      ? true
      : false;
  if (id && extend) {
    _data.read(_toknes.folder, id, (err, data) => {
      if (!err && data) {
        if (data.expires > Date.now()) {
          data.expires = Date.now() + 1000 * 60 * 60;
          _data.update(_toknes.folder, id, data, err => {
            if (!err) {
              callback(200);
            } else {
              callback(500, {
                Error: "Could not update the token's expiration."
              });
            }
          });
        } else {
          callback(400, {
            Error: 'The token has already expired, and cannot be extended.'
          });
        }
      } else {
        callback(400, { Error: 'I could not find the specified token.' });
      }
    });
  } else {
    callback(400, {
      Error: 'Missing required field(s) or field(s) are invelid'
    });
  }
};

// Token - delete
// Required Data : id;
// Optional Data : none;
_toknes.delete = (data, callback) => {
  const id =
    typeof data.queryStringObject.id == 'string' &&
    data.queryStringObject.id.trim().length > 0
      ? data.queryStringObject.id.trim()
      : false;
  console.dir(data.queryStringObject, { colors: true });

  if (id) {
    _data.read(_toknes.folder, id, (err, data) => {
      if (!err && data) {
        _data.delete(_toknes.folder, id, (err, data) => {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: 'Could not delete the file.' });
          }
        });
      } else {
        callback(400, { Error: 'The specific token does not exist.' });
      }
    });
  } else {
    callback(400, {
      Error: 'Missing required field(s) or field(s) are invalid.'
    });
  }
};

module.exports = lib;
