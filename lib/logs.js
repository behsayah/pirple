/*
 * 
 * Logging Library
 * 
 * 
 */

// Dependencies (NodeJS)
// Depenencies (localhost)
// Main Container
const lib = {};
// Console Log Colors
lib.colors = { red: 31, green: 32, default: 36 };
// Console Log
lib.console = function(txt, color) {
  console.log(``, txt);
};
// Export Module
module.exports = lib;
