/*
 * CLI-Related Tasks.
 *
 */

// Dependencies (NodeJS)
const readline = require('readline');

// Dependencies (Lcoalhost)
const e = require('./cli.event');

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
  'more log info',
  'menu',
  'order',
  'user'
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

// Export Module
module.exports = cli;
