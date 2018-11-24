/*
 * Shopping cart
 * Description : Shopping card is a property of
 *
 */

// Dependencies (NodeJS)
// Dependencies (Local)
const _data = require('../../../lib/data');
const _token = require('../../../lib/token');

// Main Container
const lib = (data, callback) => {
  acceptableMethod = ['post', 'get', 'put', 'delete'];
  if (acceptableMethod.indexOf(data.method) > -1) {
    _cart[data.method](data, callback);
  } else {
    callback(404);
  }
};

// Main Functionality Container
const _cart = {};

_cart.folder = 'carts';

// Required Data : token, phonenumber, itemName
// Optional Data : none.
// Description : Add item to current shoping card. Shoping card is part of the user data.
// @TODO :  Validate token and compare with phone number.
_cart.post = (data, callback) => {
  const token =
    typeof data.headers.token == 'string' && data.headers.token.length() > 0
      ? data.headers.token
      : false;
  const phone =
    typeof data.payload.phone == 'string' && data.payload.phone.length() > 0
      ? data.payload.phone
      : false;
  const item =
    typeof data.payload.item == 'string' && data.payload.item.length() > 0
      ? data.payload.item
      : false;
  if (token) {
  }
};

// Required Data : title.
// Optional Data : none.
// Description :  With this function we will return open order.
// @TODO : validate Token and compare with phone number.
_cart.get = (data, callback) => {
  const token =
    typeof data.headers.token == 'string' && data.headers.token.length() > 0
      ? data.headers.token
      : false;

  if (token) {
    _data.read(_cart.folder, token, (err, list) => {
      if (!err && list) {
        callback(200, list);
      } else {
        callback(404, { Error: `The user doesn't submit any order.` });
      }
    });
  } else {
    callback(403, {
      Error: 'Missing required token in header, or invalid token'
    });
  }
};

// Export Module
module.exports = lib;
