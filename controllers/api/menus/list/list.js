/*
 * Main File for List of menu
 *
 *
 */

// Dependencies (NodeJS)
// Dependencies (LocalHost)
const _data = require('../../../../lib/data');
const libTokens = require('../../../../lib/token');

// Main Container
const lib = (data, callback) => {
  acceptableMethod = ['get'];
  if (acceptableMethod.indexOf(data.method) > -1) {
    return _list[data.method](data, callback);
  }
  return callback(404);
};

// Main List Container
const _list = {};

// Folder that container all data.
_list.folder = 'menus';

// Required Data :  none.
// Optional Data : none.
// Description :  Return list of Menus.
_list.get = (data, callback) => {
  // Permission Token.
  const token =
    typeof data.headers.token == 'string' ? data.headers.token : false;

  const phone =
    typeof data.payload.phone == 'string' &&
    data.payload.phone.trim().length > 0
      ? data.payload.phone
      : false;
  if (token && phone) {
    libTokens.verifyToken(token, phone, tokenIsValid => {
      console.log('');
      if (tokenIsValid) {
        _data.list(_list.folder, (err, list) => {
          if (!err && typeof list == 'object' && list.length > 0) {
            let temp = [];
            list.forEach(item => {
              _data.read(_list.folder, item, (err, fileInfo) => {
                if (!err && typeof fileInfo == 'object') {
                  temp.push(fileInfo);
                  if (list.length === Object.keys(temp).length) {
                    return callback(200, temp);
                  }
                }
              });
            });
          } else {
            callback(400, { Error: 'Could not read the specific folder.' });
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

// Module Exports
module.exports = lib;
