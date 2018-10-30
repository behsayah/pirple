/*
 * Create and Export configuration variable
 *
 * 
 * 
 */

const environment = {};

environment.staging = {
  httpPort: 3000,
  envName: 'staging'
};

environment.production = {
  httpPort: 5000,
  envName: 'production'
};

const currentEnvironment =
  typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV : '';

const environmentExport =
  typeof environment[currentEnvironment] == 'object'
    ? environment[currentEnvironment]
    : environment.staging;

module.exports = environmentExport;
