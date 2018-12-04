/*
 * Example VM
 * Running some arbitary command
 *
 */

// Dependencies (Node JS)
const vm = require('vm');
// Dependencies (LocalHost)

// Main Container
const lib = {};
lib.context = {
  foo: 25
};
lib.sample = () => {
  const script = new vm.Script(`
  foo = foo * 2;
  var bar = foo + 1;
  var fizz = 52;
`);

  script.runInNewContext(lib.context);
  console.log(lib.context);
};

if (require.main === module) {
  lib.sample();
}

// Export module
if (require.main !== module) {
  module.exports = lib;
}
