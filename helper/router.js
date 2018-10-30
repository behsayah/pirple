/*
 * The main app router file
 *
 * 
 * 
 */

// Dependencies (NodeJS)
// Dependencies (local)
const handlers = require('../controllers/handlers');

// The router container
const router = {
  ping: handlers.ping,
  hello: handlers.hello,
  '404': handlers.notFound
};

module.exports = router;
