/*
 * Menus Main
 *
 *
 */

// Dependencies (NodeJS)
// Dependencies (LocalHost)
const _data = require('../../../lib/data');

// Main Container for APIs
const lib = function(data, callback) {
  acceptableMethod = ['post', 'get', 'put', 'delete'];
  if (acceptableMethod.indexOf(data.method) > -1) {
    _menu[data.method](data, callback);
  } else {
    callback(404);
  }
};

const _menu = {};

// Data Folder
_menu.folder = 'menus';

// Save new item
// Required Data: title, ingredient, price, estimateTime.
// Optional Data: none.
// @TODO Only let an authenticated user access their object. Don't let them access anyone else.
_menu.post = function(data, callback) {
  const title =
    typeof data.payload.title == 'string' &&
    data.payload.title.trim().length > 0
      ? data.payload.title.trim()
      : false;
  const ingredient =
    typeof data.payload.ingredient == 'string' &&
    data.payload.ingredient.trim().length > 0
      ? data.payload.ingredient.trim()
      : false;
  const price =
    typeof data.payload.price == 'number' && data.payload.price > 0
      ? data.payload.price
      : false;
  const estimateTime =
    typeof data.payload.estimateTime == 'number' &&
    data.payload.estimateTime > 0
      ? data.payload.estimateTime
      : false;

  if (title && ingredient && price && estimateTime) {
    _data.read(_menu.folder, title, (err, info) => {
      if (err) {
        const item = {
          title: title,
          ingredient: ingredient,
          price: price,
          estimateTime: estimateTime
        };
        _data.create(_menu.folder, title, item, err => {
          console.dir(title, { colors: true });
          console.dir(item, { colors: true });
          console.dir(err, { colors: true });
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: 'Could not create the specific user.' });
          }
        });
      } else {
        callback(400, { Error: 'A menu with this title already exist' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields' });
  }
};

// Get Data
// Required Data: title.
// Optional Data: none.
// @TODO Only let an authenticated user access their object. Don't let them access anyone else.
_menu.get = (data, callback) => {
  const title =
    typeof data.queryStringObject.title == 'string' &&
    data.queryStringObject.title.trim().length > 0
      ? data.queryStringObject.title.trim()
      : false;
  console.log('TITLE', title);
  if (title) {
    _data.read(_menu.folder, title, (err, info) => {
      if (!err && info) {
        callback(200, info);
      } else {
        callback(404, { Error: 'Could not find the specific menu' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

// Update Data
// Required Data : title.
// Optional Data : title, ingredient, price, estimateTime.
// @TODO Only let an authenticated user access their object. Don't let them access anyone else.
_menu.put = (data, callback) => {
  const title =
    typeof data.queryStringObject.title == 'string' &&
    data.queryStringObject.title.trim().length > 0
      ? data.queryStringObject.title.trim()
      : false;
};

// Export Module
module.exports = lib;
