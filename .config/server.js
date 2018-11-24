/*
 * Server-related tasks
 *
 *
 */

// Dependencies (NodeJS)
const fs = require('fs');
const url = require('url');
const http = require('http');
const https = require('https');
const path = require('path');
const StringDecoder = require('string_decoder').StringDecoder;
// Dependencies (Debug)
const util = require('util');
const debug = util.debuglog('server');

// Dependecies (local)
const config = require('../lib/config');
const routers = require('../lib/router');
const helper = require('../lib/helper');

// Instantiate the server module object
const server = {};

// Configure the server to respond to all requests with a string
server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

// Instantiate the HTTPs Server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};
server.httpsServer = https.createServer(
  server.httpsServerOptions,
  (req, res) => {
    console.log('GET HTTPS request');
    server.unifiedServer(req, res);
  }
);

// All the server logic for both the http and https server
server.unifiedServer = (req, res) => {
  // Parse the url
  const parsedUrl = url.parse(req.url, true);
  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  // Get the HTTP method
  const method = req.method.toLowerCase();
  // Get the query string as an object
  const queryStringObject = parsedUrl.query;
  // Get the header as an object
  const headers = req.headers;
  // @REGION Get the payload, if any.
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', data => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
    let chosenHandler =
      typeof routers[trimmedPath] !== 'undefined'
        ? routers[trimmedPath]
        : routers['404'];
    // If the request is within the public directory, use the public handler insted.
    chosenHandler =
      trimmedPath.indexOf('public/') > -1 ? routers['public'] : chosenHandler;
    // Construct the data object to send to the handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helper.parseJsonToObject(buffer)
    };

    try {
      console.dir(trimmedPath, { colors: true });
      chosenHandler(data, (statusCode, payload, contentType) => {
        server.processHandlerResponse(
          res,
          method,
          trimmedPath,
          statusCode,
          payload,
          contentType
        );
      });
    } catch (error) {
      console.dir(error, { colors: true });
      debug(error);
      server.processHandlerResponse(
        res,
        method,
        trimmedPath,
        500,
        { Error: 'An unknown error has occured' },
        'json'
      );
    }
  });
  // @END-REGION
};

// Process the response from the handler.
server.processHandlerResponse = (
  res,
  method,
  trimmedPath,
  statusCode,
  payload,
  contentType
) => {
  // Determine the type of response (fallback to JSON)
  contentType = typeof contentType == 'string' ? contentType : 'json';

  // Use the status code returned from the handler, or set the default status code to 200
  statusCode = typeof statusCode == 'number' ? statusCode : 200;

  // Return the response parts that are content-type specific
  let payloadString = '';
  if (contentType == 'json') {
    res.setHeader('Content-Type', 'application/json');
    payload = typeof payload == 'object' ? payload : {};
    payloadString = JSON.stringify(payload);
  }
  if (contentType == 'html') {
    res.setHeader('Content-Type', 'text/html');
    payloadString = typeof payload == 'string' ? payload : '';
  }
  if (contentType == 'favicon') {
    res.setHeader('Content-Type', 'image/x-icon');
    payloadString = typeof payload !== 'undefined' ? payload : '';
  }

  if (contentType == 'css') {
    res.setHeader('Content-Type', 'text/css');
    payloadString = typeof payload !== 'undefined' ? payload : '';
  }

  if (contentType == 'png') {
    res.setHeader('Content-Type', 'image/png');
    payloadString = typeof payload !== 'undefined' ? payload : '';
  }

  if (contentType == 'jpg') {
    res.setHeader('Content-Type', 'image/jpeg');
    payloadString = typeof payload !== 'undefined' ? payload : '';
  }

  if (contentType == 'plain') {
    res.setHeader('Content-Type', 'text/plain');
    payloadString = typeof payload !== 'undefined' ? payload : '';
  }

  // Return the response-parts common to all content-types
  res.writeHead(statusCode);
  res.end(payloadString);

  const logPath = trimmedPath == '' ? 'localhost' : trimmedPath;

  // Console Log :
  console.log('\x1b[32m%s\x1b[0m', 'Response was sent : ' + logPath);
};

// Init server
server.init = function() {
  // Start the HTTP server
  server.httpServer.listen(config.httpPort, () => {
    console.log(
      '\x1b[36m%s\x1b[0m',
      'The HTTP server is running on port ' + config.httpPort
    );
  });

  // Start the HTTPs server
  server.httpsServer.listen(config.httpsPort, () => {
    console.log(
      '\x1b[36m%s\x1b[0m',
      'The HTTP server is running on port ' + config.httpsPort
    );
  });
};

// Export the module
module.exports = server;
