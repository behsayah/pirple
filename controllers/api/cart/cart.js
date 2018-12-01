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

_cart.folder = {
  user: 'users',
  menu: 'menus'
};

// Required Data : token, phonenumber, itemName
// Optional Data : none.
// Description : Add item to current shoping card. Shoping card is part of the user data.
// @TODO :  Validate token and compare with phone number.
_cart.post = (data, callback) => {
  const token =
    typeof data.headers.token == 'string' && data.headers.token.length > 0
      ? data.headers.token
      : false;
  const phone =
    typeof data.payload.phone == 'string' && data.payload.phone.length > 0
      ? data.payload.phone
      : false;
  const item =
    typeof data.payload.item == 'string' && data.payload.item.length > 0
      ? data.payload.item
      : false;
  let qty =
    typeof data.payload.qty == 'number' && data.payload.qty > 0
      ? data.payload.qty
      : false;

  if (token && phone && item && qty) {
    _token.verifyToken(token, phone, isValid => {
      if (isValid) {
        _data.read(_cart.folder.user, phone, (err, userInfo) => {
          if (!err && userInfo) {
            _data.read(_cart.folder.menu, item, (err, menuItemInfo) => {
              if (!err && menuItemInfo) {
                menuItemInfo.qty = qty;
                userInfo.cart =
                  typeof userInfo.cart == 'object' &&
                  Array.isArray(userInfo.cart)
                    ? userInfo.cart
                    : [];

                userInfo.cart.forEach(element => {
                  if (element.title === menuItemInfo.title) {
                    element.qty += qty;
                    qty = 0;
                  }
                });

                qty > 0 ? userInfo.cart.push(menuItemInfo) : undefined;

                _data.update(_cart.folder.user, phone, userInfo, err => {
                  if (!err) {
                    callback(200, { msg: 'The item is stored' });
                  } else {
                    callback(500, {
                      Error: 'Could not save cart for the specific user.'
                    });
                  }
                });
              } else {
                callback(400, { Error: 'Could not find the specific menu' });
              }
            });
          } else {
            callback(400, { Error: 'Could not find the specific user.' });
          }
        });
      } else {
        callback(403, {
          Error: 'Missing required token in header, or invalid token.'
        });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields.' });
  }
};

// Required Data : title.
// Optional Data : none.
// Description :  With this function we will return open order.
// @TODO : validate Token and compare with phone number.
_cart.get = (data, callback) => {
  const token =
    typeof data.headers.token == 'string' && data.headers.token.length > 0
      ? data.headers.token
      : false;
  const phone =
    typeof data.payload.phone == 'string' && data.payload.phone.length > 0
      ? data.payload.phone
      : false;

  if (token && phone) {
    _token.verifyToken(token, phone, isValid => {
      if (isValid) {
        _data.read(_cart.folder.user, phone, (err, info) => {
          if (!err && info) {
            info.cart =
              typeof info.cart == 'object' && Array.isArray(info.cart)
                ? info.cart
                : [];
            callback(200, info.cart);
          } else {
            callback(404, { Error: `The user doesn't submit any order.` });
          }
        });
      } else {
        callback(403, {
          Error: 'Missing required token in header, or invalid token.'
        });
      }
    });
  } else {
    callback(400, {
      Error: 'Missing required fields.'
    });
  }
};

// Required Data : token, phone, item
// Optional Data : none.
// Description : Delete specific item.
_cart.delete = (data, callback) => {
  const token =
    typeof data.headers.token == 'string' && data.headers.token.length > 0
      ? data.headers.token
      : false;
  const phone =
    typeof data.payload.phone == 'string' && data.payload.phone.length > 0
      ? data.payload.phone
      : false;
  const item =
    typeof data.payload.item == 'string' && data.payload.item.length > 0
      ? data.payload.item
      : false;
};

// Export Module
module.exports = lib;
