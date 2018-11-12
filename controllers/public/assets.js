/*
 * Handle Pulic Assets
 *
 * 
 */

// Dependencies (NodeJS)
const fs = require('fs');
const path = require('path');
// Dependencies (Localhost)

// Main Container
const lib = (data, callback) => {
  const acceptableMethod = ['get'];
  // Reject any request that isn't a GET
  if (acceptableMethod.indexOf(data.method) > -1) {
    _publicAssets[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Main Handler Container
const _publicAssets = {};

// Return Assets
_publicAssets.get = function(data, callback) {
  // Get the filename being requested.
  const trimmedAssetName = data.trimmedPath.replace('public/', '').trim();

  if (trimmedAssetName.length > 0) {
    // Read in the asset's data.
    _publicAssets.getStaticAsset(trimmedAssetName, (err, data) => {
      if ((!err, data)) {
        // Determine the content type (default to plain text)
        var contentType = 'plain';
        if (trimmedAssetName.indexOf('.css') > -1) {
          contentType = 'css';
        }
        if (trimmedAssetName.indexOf('.png') > -1) {
          contentType = 'png';
        }
        if (trimmedAssetName.indexOf('.jpg') > -1) {
          contentType = 'jpg';
        }
        if (trimmedAssetName.indexOf('.ico') > -1) {
          contentType = 'favicon';
        }
        callback(200, data, contentType);
      } else {
        callback(404);
      }
      ``;
    });
  } else {
    callback(404);
  }
};

_publicAssets.getStaticAsset = (fileName, callback) => {
  fileName =
    typeof fileName == 'string' && fileName.length > 0 ? fileName : false;
  if (fileName) {
    const publicDir = path.join(__dirname, '/../../public/');
    fs.readFile(publicDir + fileName, (err, data) => {
      if (!err && data) {
        callback(false, data);
      } else {
        callback('No file could be find.');
      }
    });
  } else {
    callback('A valid file name was not specified');
  }
};

// Export Module
module.exports = lib;
