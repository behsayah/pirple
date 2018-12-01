/*
 * Payment Management
 *
 *
 *
 */
// Dependencies (Node JS)
const https = require('https');
const querystring = require('querystring');
// Dependencies (Localhost)
const config = require('./config');

// Main Container
const lib = {};
// Function to make a payment.
lib.pay = ({ amount, purcheseId, source }, callback) => {
  amount = typeof amount == 'number' && amount > 0 ? amount : false;
  purcheseId =
    typeof purcheseId == 'string' && purcheseId.trim().length > 0
      ? purcheseId
      : false;

  source =
    (typeof source == 'string' && source == 'tok_amex') || 'tok_visa'
      ? source
      : false;

  if (amount && purcheseId && source) {
    // Configure the request payload.
    const payload = {
      amount: amount,
      currency: 'usd',
      description: 'pizza_store' + '_' + Date.now(),
      source: source
      // idempotency_key: purcheseId
    };
    const stringPayload = querystring.stringify(payload);
    const requestDetails = {
      protocol: 'https:',
      hostname: 'api.stripe.com',
      port: 443,
      method: 'POST',
      path: '/v1/charges',
      timeout: 5 * 1000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload),
        Authorization: `Bearer ${config.stripe.secretApiKeyTest}`
      }
    };
    console.log('Request Details:');
    console.dir(requestDetails, { colors: true });
    console.log('Payload:');
    console.dir(stringPayload, { colors: true });

    const req = https.request(requestDetails, res => {
      if (res.statusCode === 200) {
        callback(false);
      } else {
        callback(true, { Error: 'Status code return was : ' + res.statusCode });
      }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error', e => {
      callback(true, e);
    });

    // Bind to the timeout event
    req.on('timeout', () => {
      callback(true, { Error: 'The request took much time and got timeout.' });
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();

    // Use NPM.
    // stripe.charges.create(
    //   {
    //     amount: total,
    //     currency: 'usd',
    //     source: 'tok_visa', // obtained with Stripe.js
    //     description: 'Charge for jenny.rosen@example.com'
    //   },
    //   {
    //     idempotency_key: purcheseId
    //   },
    //   (err, charge) => {
    //     if (!err && charge) {
    //       callback(false, charge);
    //     } else {
    //       console.log('============>ERROR PAYMENT<============');
    //       callback(err, 0);
    //     }
    //     // asynchronously called
    //   }
    // );
  } else {
    console.log(amount);
    callback(true, { Error: 'Missing required information' });
  }
};

// Export Module
module.exports = lib;
