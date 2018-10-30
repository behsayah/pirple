/*
 * Primary file for API
 *
 * 
 */

// Dependencies (NodeJS)
const url = require('url');
const http = require('http');
const StringDecoder = require('string_decoder').StringDecoder;

// Dependecies (local)
const config = require('./helper/config');
const routers = require('./helper/router');

// Configure the server to respond to all requests with a string
const server = http.createServer((req, res) => {
  // Parse the url
  const parsedUrl = url.parse(req.url, true);
  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  // Get the HTTP method
  const method = req.method.toUpperCase();
  // Get the query string as an object
  const queryStringObject = parsedUrl.query;
  // Get the header as an object
  const header = req.headers;
  // @REGION Get the payload, if any.
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', data => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();
    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
    const chosenHandler =
      typeof routers[trimmedPath] !== 'undefined'
        ? routers[trimmedPath]
        : routers['404'];

    // Construct the data object to send to the handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer
    };

    chosenHandler(data, (statusCode, payload) => {
      // Use the status code returned from the handler, or set the default status code to 200
      statusCode = typeof statusCode == 'number' ? statusCode : 200;

      payload = typeof payload == 'object' ? payload : {};

      const payloadString = JSON.stringify(payload);

      // Return the response
      res.writeHead(payloadString);
      res.end('Hello Word!');

      // Console Log :
      console.log('\x1b[32m%s\x1b[0m', 'Response was sent : ' + trimmedPath);
    });
  });
  // @END-REGION
  res.end('Hello World! ');
});

server.listen(config.httpPort, () => {
  console.log(
    '\x1b[36m%s\x1b[0m',
    'The HTTP server is running on port ' + config.httpPort
  );
});
