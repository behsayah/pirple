/*
 * Checkout Page
 *
 *
 */

// Dependencies (NodeJS)
const fs = require('fs');
const path = require('path');
// Dependencies (Localhosts)
const config = require('../../.config/config');
const _data = require('../../lib/data');
const _token = require('../../lib/token');

// Main Container
var lib = function(data, callback) {
  const acceptableMethods = ['get'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _checkoutList[data.method](data, callback);
  } else {
    callback(405, undefined, 'html');
  }
};

// Response Main Container
const _checkoutList = {};
// Menu List
_checkoutList.folder = 'users';

// Index handler
_checkoutList.get = function(data, callback) {
  const templateData = {};
  templateData['head.title'] = 'Checkout List';
  templateData['head.description'] = 'It is the list of your order.';
  templateData['body.class'] = 'checkoutList';
  _checkoutList.token =
    typeof data.headers.token == 'string' &&
    data.headers.token.trim().length > 0
      ? data.headers.token.trim()
      : false;
  _checkoutList.phone =
    typeof data.headers.phone == 'string' &&
    data.headers.phone.trim().length > 0
      ? data.headers.phone.trim()
      : false;
  // Read in a template as a string.
  _checkoutList.getTemplate('checkout', templateData, (err, str) => {
    if (!err && str) {
      // Add the universal header and footer.
      _checkoutList.addUniversalTemplate(str, templateData, (err, str) => {
        if ((!err, str)) {
          callback(200, str, 'html');
        } else {
          callback(500, undefined, 'html');
        }
      });
    } else {
      callback(500, undefined, 'html');
    }
  });
  // callback(undefined, undefined, 'html');
};

// Get the string content of a template.
_checkoutList.getTemplate = (templateName, data, callback) => {
  templateName =
    typeof templateName == 'string' && templateName.length > 0
      ? templateName
      : false;
  if (templateName) {
    const templateDir = path.join(__dirname, './../../template/');
    fs.readFile(templateDir + templateName + '.html', 'utf8', (err, str) => {
      if (!err && str && str.length > 0) {
        // Do interpolation on the data
        let finalString = _checkoutList.interpolate(str, data);
        callback(false, finalString);
      } else {
        callback('No Template could be found.');
      }
    });
  } else {
    callback('A valid template name was not specified.');
  }
};

// Add the universal header and footer to a string, and pass provided data object to the header and footer for interpolation.
_checkoutList.addUniversalTemplate = function(str, data, callback) {
  str = typeof str == 'string' && str.length > 0 ? str : '';
  data = typeof data == 'object' && data !== null ? data : {};

  // Get header
  _checkoutList.getTemplate('_header', data, (err, headerString) => {
    if (!err && headerString) {
      _checkoutList.getTemplate('_footer', data, (err, footerTemplate) => {
        if (!err && footerTemplate) {
          _checkoutList.getList((err, body) => {
            if (!err && body) {
              str = str.replace('{checkout}', body);
            } else {
              str = str.replace('{checkout}', 'Could not get the menu items');
            }
            let fullString = headerString + str + footerTemplate;
            callback(false, fullString);
          });
        } else {
          callback('Could not find the footer template');
        }
      });
    } else {
      callback('Could not find the header template.');
    }
  });
};

// Take a given string and a data object and find/replace all the keys within it.
_checkoutList.interpolate = function(str, data) {
  str = typeof str == 'string' && str.length > 0 ? str : '';
  data = typeof data == 'object' && data !== null ? data : {};
  // Add the templateGlobal to the data object, prepending their key name with "global"
  for (let keyName in config.templateGlobal) {
    if (config.templateGlobal.hasOwnProperty(keyName)) {
      data['global.' + keyName] = config.templateGlobal[keyName];
    }
  }
  // For each key in the data object, insert its value into the string at the corresponding placeholder.
  for (let key in data) {
    if (data.hasOwnProperty(key) && typeof data[key] == 'string') {
      let replace = data[key];
      let find = `{${key}}`;
      str = str.replace(find, replace);
    }
  }

  // Return string
  return str;
};

_checkoutList.getList = function(callback) {
  let temp = [];
  const phone = _checkoutList.phone ? _checkoutList.phone : false;
  const token = _checkoutList.token ? _checkoutList.token : false;
  console.log('PHONE=========>', phone);
  console.log('TOKEN=========>', token);

  if (phone && token) {
    _token.verifyToken(token, phone, isValid => {
      if (isValid) {
        _data.read(_checkoutList.folder, phone, (err, userData) => {
          if (!err && userData) {
            if (userData.cart) {
              userData.cart.forEach(item => {
                temp.push(`
                  <tr>
                    <td>${item.title}</td>
                    <td>${item.ingredient}</td>
                    <td>${item.price}</td>
                    <td>${item.estimateTime}</td>
                    <td>${item.qty}</td>
                  </tr>
                `);
              });
              callback(false, temp.join());
            } else {
              callback(false, [`You do not have order in the list.`]);
            }
          } else {
            callback(true, [`The specific user is not found.`]);
          }
        });
      } else {
        callback(false, [`<p>Your login information is not valid</p>`]);
      }
    });
  } else {
    callback(false, [`<p>You need to login to the website.</p>`]);
  }
};

// Export Module
module.exports = lib;
