/*
 * Checkout
 *
 *
 */

// Dependencies (NodeJS)
// Dependencies (Localhost)
const hellpers = require('../../../../lib/helper');
const _token = require('../../../../lib/token');
const _data = require('../../../../lib/data');
const _pay = require('../../../../lib/pay');
const _email = require('../../../../lib/email');

// Main Object
const lib = (data, callback) => {
  acceptablerMethod = ['post', 'get'];
  if (acceptablerMethod.indexOf(data.method) > -1) {
    _checkout[data.method](data, callback);
  } else {
    callback(404);
  }
};

// Main Functionality Container
_checkout = {};

// Folders
_checkout.folders = {
  user: 'users'
};

// Required Data : token, phone.
// Optional Data : none.
// Description : Post Check out
_checkout.post = (data, callback) => {
  try {
    const token =
      typeof data.headers.token == 'string' && data.headers.token.length > 0
        ? data.headers.token
        : false;
    const phone =
      typeof data.payload.phone == 'string' && data.payload.phone.length > 0
        ? data.payload.phone
        : false;

    if (token && phone) {
      _token.verifyToken(token, phone, isValid => {
        if (isValid) {
          // Find the user and read the user's car.
          _data.read(_checkout.folders.user, phone, (err, userInfo) => {
            if (!err && userInfo) {
              if (
                typeof userInfo.cart == 'object' &&
                Array.isArray(userInfo.cart) &&
                userInfo.cart.length > 0
              ) {
                let amount = 0;
                userInfo.cart.forEach(element => {
                  amount += element.price * 8;
                });
                if (amount > 0) {
                  // Create a purchase ID
                  const purcheseId = hellpers.createRandomString(16);
                  // Process payment.
                  _pay.pay(
                    {
                      amount: amount,
                      purcheseId: purcheseId,
                      source: 'tok_visa'
                    },
                    (err, msg) => {
                      if (!err) {
                        console.log(
                          '============>SUCCESS PAYMENT<============'
                        );
                        // Make sure that the user have purchase property.
                        userInfo.purchese =
                          typeof userInfo.purchese == 'object' &&
                          Array.isArray(userInfo.purchese)
                            ? userInfo.purchese
                            : [];
                        // Add the order to user's history.
                        userInfo.purchese.push({
                          items: userInfo.cart,
                          id: purcheseId,
                          date: new Date()
                        });

                        userInfo.cart = [];
                        // Update the user's information.
                        _data.update(
                          _checkout.folders.user,
                          phone,
                          userInfo,
                          err => {
                            if (!err) {
                              const payload = {
                                to: userInfo.email,
                                subject: 'Thanks for your order!',
                                text: 'Your payment goes throw!'
                              };
                              // Send the reciet to the customer.
                              _email.send(payload, (err, body) => {
                                if (!err) {
                                  callback(200, {
                                    msg:
                                      'Process the payment goes through. You will get the reciept via email shortly.'
                                  });
                                } else {
                                  callback(500, {
                                    msg:
                                      'Your payment goes throught but could not send the reciept via email.'
                                  });
                                }
                              });
                            } else {
                              callback(500, {
                                Error: 'Could not update user history.'
                              });
                            }
                          }
                        );
                        // _data.create()
                      } else {
                        console.log('============>ERROR PAYMENT<============');
                        // console.dir(err, { colors: true });
                        // console.dir(msg, { colors: true });
                        callback(500, msg);
                      }
                    }
                  );
                } else {
                  callback(400, { Error: 'Total is ziro.' });
                }
              } else {
                callback(400, {
                  Error: `The specific user doesn't have item in the cart`
                });
              }
            } else {
              callback(400, {
                Error: 'Could not access to specific user info.'
              });
            }
          });
        } else {
          callback(403, {
            Error: 'Missing required token in header, or invalid token'
          });
        }
      });
    } else {
      callback(400, { Error: 'Missing required fields' });
    }
  } catch (error) {
    console.log('ERROR :');
    console.dir(error, { colors: true });
  }
};

// Required Data : token, phone
// Optional Data : none.
// Description : Send a reseat.
_checkout.get = (data, callback) => {
  // _pay.pay(
  //   {
  //     amount: 200,
  //     purcheseId: hellpers.createRandomString(16),
  //     source: 'tok_amex'
  //   },
  //   err => {
  //     console.log(msg);
  //     callback(err);
  //   }
  // );
};

// Export Module
module.exports = lib;
