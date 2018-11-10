/*
 * Create and Export configuration variable
 *
 * 
 * 
 */

const environment = {};

environment.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging',
  hashingSecret: 'thisIsASecret',
  templateGlobal: {
    appName: 'UptimeCheaker',
    companyName: 'NotARealCompany, Inc',
    yearCreated: 2018,
    baseUrl: 'http://localhost:3000'
  }
};

environment.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
  hashingSecret: 'thisIsASecret',
  templateGlobal: {
    appName: 'UptimeCheaker',
    companyName: 'NotARealCompany, Inc',
    yearCreated: 2018,
    baseUrl: 'http://localhost:5000'
  }
};

const currentEnvironment =
  typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV : '';

const environmentExport =
  typeof environment[currentEnvironment] == 'object'
    ? environment[currentEnvironment]
    : environment.staging;

module.exports = environmentExport;
