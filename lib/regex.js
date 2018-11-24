/*
 * You can get all the regular expresions.
 *
 *
 */

const lib = {};

lib.email = () => {
  return '[a-z0-9._%+-]+@+[a-z0-9.-]+[.com|.net|.ir|.io]';
};

module.exports = lib;
