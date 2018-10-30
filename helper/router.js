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
  sample: handlers.sample,
  '404': handlers.notFound
};

module.exports = router;
