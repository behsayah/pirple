/*
 * Create an account handler
 * 
 * 
 */

// Dependencies (NodeJS)
const fs = require('fs');
const path = require('path');
// Dependencies (Localhosts)
const config = require('../../../lib/config');

// Main Container
var lib = function(data, callback) {
  const acceptableMethods = ['get'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _accountCreate[data.method](data, callback);
  } else {
    callback(405, undefined, 'html');
  }
};

// Response Main Container
const _accountCreate = {};
// Index handler
_accountCreate.get = function(data, callback) {
  const templateData = {};
  templateData['head.title'] = 'Create an accoutn';
  templateData['head.description'] = 'It is easy and only takes a few second.';
  templateData['body.class'] = 'accountCreate';

  // Read in a template as a string.
  _accountCreate.getTemplate('accountCreate', templateData, (err, str) => {
    if (!err && str) {
      // Add the universal header and footer.
      _accountCreate.addUniversalTemplate(str, templateData, (err, str) => {
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
_accountCreate.getTemplate = (templateName, data, callback) => {
  templateName =
    typeof templateName == 'string' && templateName.length > 0
      ? templateName
      : false;
  if (templateName) {
    const templateDir = path.join(__dirname, './../../../template/');
    fs.readFile(templateDir + templateName + '.html', 'utf8', (err, str) => {
      if (!err && str && str.length > 0) {
        // Do interpolation on the data
        let finalString = _accountCreate.interpolate(str, data);
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
_accountCreate.addUniversalTemplate = function(str, data, callback) {
  str = typeof str == 'string' && str.length > 0 ? str : '';
  data = typeof data == 'object' && data !== null ? data : {};
  // Get header
  _accountCreate.getTemplate('_header', data, (err, headerString) => {
    if (!err && headerString) {
      _accountCreate.getTemplate('_footer', data, (err, footerTemplate) => {
        if (!err && footerTemplate) {
          let fullString = headerString + str + footerTemplate;
          callback(false, fullString);
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
_accountCreate.interpolate = function(str, data) {
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

// Export Module
module.exports = lib;
