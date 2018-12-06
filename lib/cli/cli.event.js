/*
 * Cli Event Handler
 *
 *
 *
 */

// Dependencies (Node JS)
const event = require('events');
class _events extends event {}
const e = new _events();

const util = require('util');
const debug = util.debuglog('cli');

const os = require('os');
const v8 = require('v8');
// Dependencies (Localhost)
const _data = require('../data');
const _cliHelper = require('./cli.helper');

// Input handlers.
e.on('man', str => {
  lib.help();
});
e.on('help', str => {
  lib.help();
});
e.on('exit', () => {
  lib.exit();
});
e.on('stats', () => {
  lib.stats();
});
e.on('list users', () => {
  lib.listUsers();
});
e.on('more user info', str => {
  lib.moreUserInfo(str);
});
e.on('list logs', () => {
  lib.listLogs();
});
e.on('more log info', str => {
  lib.moreLogInfo(str);
});
e.on('menu', str => {
  lib.menuList(str);
});
e.on('order', str => {
  lib.order(str);
});
e.on('user', str => {
  lib.user(str);
});

// ########## Functionality ##########
// Responder Container Object
lib = {};

// Help / Man
lib.help = () => {
  // Codify the commands and their explanations
  var commands = {
    exit: 'Kill the CLI (and the rest of the application)',
    man: 'Show this help page',
    help: 'Alias of the "man" command',
    stats:
      'Get statistics on the underlying operating system and resource utilization',
    'List users':
      'Show a list of all the registered (undeleted) users in the system',
    'More user info --{userId}': 'Show details of a specified user',
    'List checks --up --down':
      'Show a list of all the active checks in the system, including their state. The "--up" and "--down flags are both optional."',
    'More check info --{checkId}': 'Show details of a specified check',
    'List logs':
      'Show a list of all the log files available to be read (compressed and uncompressed)',
    'More log info --{logFileName}': 'Show details of a specified log file',
    'menu --list': 'Display Menu',
    'order --list': 'Shoe list of orders',
    'order --detail --{order id}': 'Show detail of a order.',
    'user --list': 'Show list of users',
    'user --detail --{user id}': 'Show user detail.'
  };
  _cliHelper.horizontalLine();
  _cliHelper.centered('CLI MANUAL');
  _cliHelper.horizontalLine();
  _cliHelper.verticalSpace();

  for (let key in commands) {
    if (commands.hasOwnProperty(key)) {
      const value = commands[key];
      let line = '\x1b[33m' + key + '\x1b[0m';
      const padding = 40 - key.length;
      for (let i = 0; i < padding; i++) {
        line += ' ';
      }
      line += value;
      console.log(line);
    }
  }

  _cliHelper.verticalSpace(1);
  // End with another horizontal line.
  _cliHelper.horizontalLine();
};
// Exit
lib.exit = () => {
  console.log('You asked to exit');
  console.log('we are rapping up everything and exit');
  process.exit(0);
};
// Stats
lib.stats = () => {
  // Codify the commands and their explanations
  const stats = {
    'Load Average': os.loadavg().join(' '),
    'CPU Count': os.cpus().length,
    'Free Memory': os.freemem(),
    'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
    'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap Used (%)': Math.round(
      (v8.getHeapStatistics().used_heap_size /
        v8.getHeapStatistics().total_heap_size) *
        100
    ),
    'Available Heap Allocated (%)': Math.round(
      (v8.getHeapStatistics().total_heap_size /
        v8.getHeapStatistics().heap_size_limit) *
        100
    ),
    Uptime: os.uptime() + ' Seconds'
  };

  // Show a header for the help page that is as wide as the screen
  _cliHelper.horizontalLine();
  _cliHelper.centered('SYSTEM STATISTICS');
  _cliHelper.horizontalLine();
  _cliHelper.verticalSpace();

  for (let key in stats) {
    if (stats.hasOwnProperty(key)) {
      const value = stats[key];
      let line = '\x1b[33m' + key + '\x1b[0m';
      const padding = 40 - key.length;
      for (let i = 0; i < padding; i++) {
        line += ' ';
      }
      line += value;
      console.log(line);
    }
  }

  _cliHelper.verticalSpace(1);
  // End with another horizontal line.
  _cliHelper.horizontalLine();
};
// List Users
lib.listUsers = () => {
  // Show a header for the help page that is as wide as the screen
  _cliHelper.horizontalLine();
  _cliHelper.centered('USERs LIST');
  _cliHelper.horizontalLine();

  // Get list of user's ids
  _data.list('users', (err, userIds) => {
    if (!err && userIds && userIds.length > 0) {
      userIds.forEach(userId => {
        _data.read('users', userId, (err, userData) => {
          if (!err && userData) {
            let line =
              'Name : ' +
              userData.firstName +
              ' Family : ' +
              userData.lastName +
              ' Phone : ' +
              userData.phone;
            console.log(line);
          }
        });
      });
    } else {
      console.log('Error : ', err);
    }
  });
};
// More User Info
lib.moreUserInfo = str => {
  _cliHelper.horizontalLine();
  _cliHelper.centered('USER INFO');
  _cliHelper.horizontalLine();

  const arr = str.split('--');
  const userId =
    typeof arr[1] == 'string' && arr[1].trim().length > 0 ? arr[1] : '';
  if (userId) {
    _data.read('users', userId, (err, userData) => {
      if (!err && userData) {
        delete userData.hashedPassword;
        _cliHelper.verticalSpace();
        console.dir(userData, { colors: true });
        _cliHelper.verticalSpace();
      }
    });
  } else {
    console.log('Error : ', err);
  }
};
// List Logs
lib.listLogs = () => {
  console.log('You asked ot list logs.');
};
// More log Info
lib.moreLogInfo = str => {
  console.log('You asked for more log info : ', str);
};
// Menu List
lib.menuList = str => {
  const arr = str.split('--');
  const command =
    typeof arr[1] == 'string' && arr[1].trim().length > 0 ? arr[1] : false;
  switch (command) {
    case 'list':
      _data.list('menus', (err, list) => {
        if (!err && list) {
          _cliHelper.verticalSpace(1);
          _cliHelper.horizontalLine();
          _cliHelper.centered('MENU');
          _cliHelper.horizontalLine();
          let counter = 0;
          list.forEach(fileName => {
            _data.read('menus', fileName, (err, detail) => {
              ++counter;
              if (!err && detail) {
                console.log(detail.title + '(' + detail.price + ')');
                console.log(detail.ingredient);
              } else {
                console.log(`I could not read ${fileName}`);
              }
              if (counter === list.length) {
                _cliHelper.horizontalLine('=');
              } else {
                _cliHelper.verticalSpace();
              }
            });
          });
        } else {
          console.log('For some reason I could not read the menu.');
        }
      });
      break;
    default:
      console.log("I don't get the command, please try again.");
  }
};
// Order
lib.order = str => {
  const arr = str.split('--');
  const command =
    typeof arr[1] == 'string' && arr[1].trim().length > 0
      ? arr[1].trim()
      : false;
  switch (command) {
    case 'list':
      lib.order.list();
      break;
    case 'detail':
      const id =
        typeof arr[2] == 'string' && arr[2].trim().length > 0 ? arr[2] : false;
      lib.order.detail(id);
      break;
    default:
      console.log("I don't get the command, please try again.");
  }
};
lib.order.list = () => {
  _data.list('users', (err, list) => {
    if (!err && list) {
      _cliHelper.verticalSpace(1);
      _cliHelper.horizontalLine();
      _cliHelper.centered('24 Hours Order');
      _cliHelper.horizontalLine();
      let counter = 0;
      list.forEach(user => {
        _data.read('users', user, (err, detail) => {
          ++counter;
          if (!err && detail) {
            if (
              typeof detail.purchese == 'object' &&
              detail.purchese.length > 0
            ) {
              detail.purchese.forEach(ord => {
                if (
                  new Date(new Date() - 1000 * 60 * 60 * 24) <
                    new Date(ord.data) &&
                  typeof ord.items == 'object' &&
                  ord.items.length > 0
                ) {
                  console.log(
                    `User : ${detail.firstName} - ${detail.lastName}`
                  );
                  ord.items.forEach(item => {
                    console.log(
                      item.title + '(Total : ' + item.price * item.qty + ')'
                    );
                  });
                }
              });
            }
          } else {
            console.log(`I could not read ${user}`);
          }
          if (counter === list.length) {
            _cliHelper.horizontalLine('=');
          } else {
            _cliHelper.verticalSpace();
          }
        });
      });
    } else {
      console.log('For some reason I could not read the menu.');
    }
  });
};
lib.order.detail = id => {
  _data.list('users', (err, list) => {
    if (!err && list) {
      _cliHelper.verticalSpace(1);
      _cliHelper.horizontalLine();
      _cliHelper.centered('Order Detail');
      _cliHelper.horizontalLine();
      let counter = 0;
      list.forEach(user => {
        _data.read('users', user, (err, detail) => {
          ++counter;
          if (!err && detail) {
            if (
              typeof detail.purchese == 'object' &&
              detail.purchese.length > 0
            ) {
              detail.purchese.forEach(ord => {
                if (
                  typeof ord.id == 'string' &&
                  ord.id.length > 0 &&
                  ord.id === id
                ) {
                  console.log(
                    `User : ${detail.firstName} - ${detail.lastName}`
                  );
                  ord.items.forEach(item => {
                    console.log(
                      item.title + '(Total : ' + item.price * item.qty + ')'
                    );
                  });
                }
              });
            }
          } else {
            console.log(`I could not read ${user}`);
          }
          if (counter === list.length) {
            _cliHelper.horizontalLine('=');
          } else {
            _cliHelper.verticalSpace();
          }
        });
      });
    } else {
      console.log('For some reason I could not read the menu.');
    }
  });
};
// Users
lib.user = str => {
  const arr = str.split('--');
  const command =
    typeof arr[1] == 'string' && arr[1].trim().length > 0
      ? arr[1].trim()
      : false;
  switch (command) {
    case 'list':
      lib.user.list();
      break;
    case 'detail':
      const email =
        typeof arr[2] == 'string' && arr[2].trim().length > 0 ? arr[2] : false;
      lib.user.email(email);
      break;
    default:
      console.log("I don't get the command, please try again.");
  }
};
lib.user.list = () => {
  _data.list('users', (err, list) => {
    if (!err && list) {
      _cliHelper.verticalSpace(1);
      _cliHelper.horizontalLine();
      _cliHelper.centered('24 Hours Users');
      _cliHelper.horizontalLine();
      let counter = 0;
      list.forEach(user => {
        _data.read('users', user, (err, userDetail) => {
          ++counter;
          if (!err && userDetail) {
            if (
              typeof new Date(userDetail.date) == 'object' &&
              new Date(new Date() - 1000 * 60 * 60 * 24) <
                new Date(userDetail.date)
            ) {
              console.log(
                `User : ${userDetail.firstName} - ${userDetail.lastName}`
              );
            }
          } else {
            console.log(`I could not read ${user}`);
          }
          if (counter === list.length) {
            _cliHelper.horizontalLine('=');
          } else {
            _cliHelper.verticalSpace();
          }
        });
      });
    } else {
      console.log('For some reason I could not read the menu.');
    }
  });
};
lib.user.email = email => {
  _data.list('users', (err, list) => {
    if (!err && list) {
      _cliHelper.verticalSpace(1);
      _cliHelper.horizontalLine();
      _cliHelper.centered(`User Detail : ${email}`);
      _cliHelper.horizontalLine();
      let counter = 0;
      list.forEach(user => {
        _data.read('users', user, (err, userDetail) => {
          ++counter;
          if (!err && userDetail) {
            if (userDetail.email === email) {
              console.log(
                `User : ${userDetail.firstName} - ${userDetail.lastName}`
              );
            }
          } else {
            console.log(`I could not read ${user}`);
          }
          if (counter === list.length) {
            _cliHelper.horizontalLine('=');
          } else {
            _cliHelper.verticalSpace();
          }
        });
      });
    } else {
      console.log('For some reason I could not read the menu.');
    }
  });
};
// Export Module
module.exports = e;
