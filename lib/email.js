/*
 * Mail
 *
 *
 */

// Dependencies (Node JS)
const https = require('https');
const querystring = require('querystring');
// const mailgun = require('mailgun-js');
// Dependencies (Localhost)
const config = require('./../.config/config');

// Main Container
const lib = {};

// Required Data :
// Optional Data :
// Description :
lib.send = ({ to, subject, text }, callback) => {
  to = typeof to == 'object' && Array.isArray(to) ? to.join(',') : to;
  subject =
    typeof subject == 'string' && subject.trim().length > 0
      ? subject.trim()
      : false;
  text =
    typeof text == 'string' && text.trim().length > 0 ? text.trim() : false;

  if (to && subject && text) {
    const payload = {
      from: config.mailgum.sandBoxFrom,
      to: to,
      subject: subject,
      text: text
    };

    const stringPayload = querystring.stringify(payload);

    const requestDetails = {
      hostname: config.mailgum.hostname,
      path: config.mailgum.path,
      protocol: config.mailgum.protocol,
      method: config.mailgum.method,
      auth: config.mailgum.auth,
      timeout: 5 * 1000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload, 'utf8')
      }
    };

    const req = https.request(requestDetails, res => {
      if (res.statusCode == 200 || res.statusCode == 201) {
        callback(false);
      } else {
        console.dir(res.statusCode, { colors: true });
        callback(true, {
          Error: `Response status code is : ${res.statusCode}`
        });
      }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error', e => {
      console.log('EMAIL ===> ', 3);
      callback(true, e);
    });

    // Bind to the timeout event
    req.on('timeout', () => {
      console.log('EMAIL ===> ', 4);
      callback(true, { Error: 'The request took much time and got timeout.' });
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  } else {
    callback(true, { Error: 'Missing required parameters.' });
  }
};

// Module Export
module.exports = lib;
