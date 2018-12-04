/*
 *
 * Handle Screen
 *
 *
 */

// Dependencies (Node JS)
// Dependencies (LocalHost)

// Main Container
const lib = {};

// Monitor Screen Resize
lib.screenSize = () => {
  process.stdout.on('resize', () => {
    console.log('Screen is resize');
  });
};

// Export Module
module.exports = lib;
