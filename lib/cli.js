/*
 * CLI-Related Tasks.
 *
 */

// Dependencies (NodeJS)
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events {}
const e = new _events();
const os = require('os');
const v8 = require('v8');
// Dependencies (Lcoalhost)
const _data = require('./data');

// Instantiate the CLI module object.
const cli = {};

// Init Script.
cli.init = () => {
  // Send the start message to the console, in dark blue.
  console.log('\x1b[34m%s\x1b[0m', 'The CLI is running');

  // Start the interface.
  //  |_ Promt: The sign shoe the start point to the user.
  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>>'
  });

  // Create an initial prompt
  _interface.prompt();

  // Handle each line of input, separately.
  _interface.on('line', str => {
    // Send to the input processor
    cli.processInput(str);
    // Re-initialize the prompt aftweward
    _interface.prompt();
  });

  // If the the user stop the CLI, kill the associated process.
  _interface.on('close', () => {
    process.exit(0);
  });
};
// Command Lists
cli.uniqueInputs = [
  'man',
  'help',
  'exit',
  'stats',
  'list users',
  'more user info',
  'list checks',
  'more check info',
  'list logs',
  'more log info'
];
// Input processor
cli.processInput = str => {
  str = typeof str == 'string' && str.trim().length > 0 ? str : false;

  let matchFound = false;
  const counter = 0;
  // Only process the input if the user actually wrote something. Otherwise ignore it.
  if (str) {
    cli.uniqueInputs.some((input, index) => {
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;
        // Emit event matching the unique input, and include the full string given.
        e.emit(input, str);
      }
    });
  }

  // If no match is found, tell the user to try again.
  if (!matchFound) {
    console.log(`I don't get it, please try again.`);
  }
};

// Input handlers.
e.on('man', str => {
  cli.responders.help();
});

e.on('help', str => {
  cli.responders.help();
});

e.on('exit', () => {
  cli.responders.exit();
});

e.on('stats', () => {
  cli.responders.stats();
});

e.on('list users', () => {
  cli.responders.listUsers();
});
e.on('more user info', str => {
  cli.responders.moreUserInfo(str);
});
e.on('list logs', () => {
  cli.responders.listLogs();
});
e.on('more log info', str => {
  cli.responders.moreLogInfo(str);
});
// Responder object
cli.responders = {};

// Help / Man
cli.responders.help = () => {
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
    'More log info --{logFileName}': 'Show details of a specified log file'
  };
  cli.horizontalLine();
  cli.centered('CLI MANUAL');
  cli.horizontalLine();
  cli.verticalSpace();

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

  cli.verticalSpace(1);
  // End with another horizontal line.
  cli.horizontalLine();
};
// Create vertical space.
cli.verticalSpace = lines => {
  lines = typeof lines == 'number' && lines > 0 ? lines : 1;
  for (let i = 0; i < lines; i++) {
    console.log('');
  }
};

cli.horizontalLine = () => {
  // Get the available screen size.
  let width = process.stdout.columns;

  let line = '';
  for (let i = 0; i < width; i++) {
    line += '-';
  }
  console.log(line);
};

cli.centered = title => {
  title =
    typeof title == 'string' && title.trim().length > 0 ? title.trim() : '';
  // Get available columns
  const columns = process.stdout.columns;

  if (title) {
    const leftPadding = Math.floor((columns - title.length) / 2);

    let line = '';
    for (let i = 0; i < leftPadding; i++) {
      line += ' ';
    }
    line += title;
    console.log(line);
  }
};

// Exit
cli.responders.exit = () => {
  console.log('You asked to exit');
  console.log('we are rapping up everything and exit');
  process.exit(0);
};
// Stats
cli.responders.stats = () => {
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
  cli.horizontalLine();
  cli.centered('SYSTEM STATISTICS');
  cli.horizontalLine();
  cli.verticalSpace();

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

  cli.verticalSpace(1);
  // End with another horizontal line.
  cli.horizontalLine();
};
// List Users
cli.responders.listUsers = () => {
  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered('USERs LIST');
  cli.horizontalLine();

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
cli.responders.moreUserInfo = str => {
  cli.horizontalLine();
  cli.centered('USER INFO');
  cli.horizontalLine();

  const arr = str.split('--');
  const userId =
    typeof arr[1] == 'string' && arr[1].trim().length > 0 ? arr[1] : '';
  if (userId) {
    _data.read('users', userId, (err, userData) => {
      if (!err && userData) {
        delete userData.hashedPassword;
        cli.verticalSpace();
        console.dir(userData, { colors: true });
        cli.verticalSpace();
      }
    });
  } else {
    console.log('Error : ', err);
  }
};
// List Logs
cli.responders.listLogs = () => {
  console.log('You asked ot list logs.');
};
// More log Info
cli.responders.moreLogInfo = str => {
  console.log('You asked for more log info : ', str);
};

// Export Module
module.exports = cli;
