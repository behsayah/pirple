/*
 *
 * Library for manupulate data.
 * 
 * 
 */

// Dependencies (NodeJS)
const fs = require('fs');
const path = require('path');
// Depencencies (loclhost)
const helpers = require('./helper');

// Object Container
const lib = {};
// Set the base directory
lib.base = path.join(__dirname + '/../.data/');
// Write data to a file.
lib.create = function(dir, file, data, callback) {
  // Validate arguments.
  // Open the file for writin.
  fs.open(lib.base + dir + '/' + file + '.json', 'wx', function(
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, function(err) {
        if (!err) {
          fs.close(fileDescriptor, function(err) {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing new File.');
            }
          });
        } else {
          callback('Error writing to new file.');
        }
      });
    } else {
      callback('Could not create the new file, it may already exist.');
    }
  });
};
// Read a file.
lib.read = function(dir, file, callback) {
  fs.readFile(lib.base + dir + '/' + file + '.json', 'utf-8', function(
    err,
    data
  ) {
    if (!err && data) {
      const parsedData = helpers.parseJsonToObject(data);
      callback(false, parsedData);
    } else {
      callback(err, data);
    }
  });
};
// Update a file
lib.update = function(dir, file, data, callbakc) {
  fs.open(lib.base + dir + '/' + file + '.json', 'r+', function(
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.truncate(fileDescriptor, function(err) {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, function(err) {
            if (!err) {
              fs.close(fileDescriptor, function(err) {
                if (!err) {
                  callbakc(false);
                } else {
                  callbakc('Error closing exisiting file.');
                }
              });
            } else {
              ('Error writing to existing file.');
            }
          });
        } else {
          callbakc('Error truncatting the file.');
        }
      });
    } else {
      callbakc('Could not open the file for update, it may not exist yet.');
    }
  });
};
// Delete a file
lib.delete = function(dir, file, callback) {
  fs.unlink(lib.base + dir + '/' + file + '.json', function(err) {
    if (!err) {
    } else {
      callback('Error deleteing file.');
    }
  });
};
// Check existing file.
// Results :  true = the file is exist. false = the file doesn't exist.
lib.isExist = function(dir, file, callback) {
  fs.exists(lib.base + dir + '/' + file + '.json', function(isExist) {
    callback(isExist);
  });
};
// Create a folder
lib.createFolder = function(dir, file, callback) {
  fs.exists(lib.path + dir, function(isExist) {
    if (!isExist) {
      callback(false);
    } else {
      callback('The folder is exist');
    }
  });
};
// Create a file

// Export the Module
module.exports = lib;
