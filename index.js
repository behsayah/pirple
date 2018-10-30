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
  const queryString = parsedUrl.query;
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
    // Send the response
    res.end('Hello Word!');
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
