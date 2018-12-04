/*
 * DNS Handler
 *
 *
 */

// Dependencies (Node JS)
const _url = require('url');
const dns = require('dns');
// Dependencies (Localhost)

// Main Container
const lib = {};

lib.verifyURL = ({ protocol, url }, callback) => {
  const parsedUrl = _url.parse(protocol + '://' + url);
  const hostName =
    typeof parsedUrl.hostname == 'string' &&
    parsedUrl.hostname.trim().length > 0
      ? parsedUrl.hostname
      : false;
  dns.resolve(hostName, (err, dnsRecord) => {
    if (!err && dnsRecord) {
      callback(false, dnsRecord);
    } else {
      callback(true, {
        Error: 'The host name of the URL did not resolve to any DNS entery'
      });
    }
  });
};

// Export Module
module.exports = lib;
