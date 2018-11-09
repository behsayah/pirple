/*
 * The main app router file
 *
 * 
 * 
 */

// Dependencies (NodeJS)
const fs = require('fs');
const path = require('path');
// Dependencies (local)
const handlers = require('../controllers/_handlers');

const router = {
  '404': handlers.notFound
};
var Router = function() {
  this.startFolder = null;
};

Router.prototype.load = function(app, folderName) {
  // this.corsSetting(app);

  if (!this.startFolder) this.startFolder = path.basename(folderName);
  fs.readdirSync(folderName).forEach(file => {
    const fullName = path.join(folderName, file);
    const stat = fs.lstatSync(fullName);

    if (stat.isDirectory()) {
      // Recursively walk-through folders
      this.load(app, fullName);
    } else if (file.toLowerCase().indexOf('.js')) {
      // Grab path to JavaScript file and use it to construct the route

      let dirs = path.dirname(fullName).split(path.sep);

      if (dirs[0].toLowerCase() === this.startFolder.toLowerCase()) {
        dirs.splice(0, 1);
      }

      // Generate the route
      const baseRoute = dirs.join('/');
      console.log('Created route: ' + baseRoute + ' for ' + fullName);

      // Load the JavaScript file ("controller") and pass the router to it
      const controllerClass = require('../' + fullName);

      // Associate the route with the router
      // app.use(baseRoute, router);
      app[baseRoute] = controllerClass;
    }
  });
};

const _routes = new Router();
_routes.load(router, './controllers');

// The router container
// const router = {
//   ping: handlers.ping,
//   hello: handlers.hello,
//   users: handlers.users,
//   '404': handlers.notFound
// };

module.exports = router;
