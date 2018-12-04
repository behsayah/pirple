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
  },
  stripe: {
    secretApiKeyTest: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc'
  },
  mailgum: {
    sandBoxFrom:
      'Mailgun Sandbox <postmaster@sandbox5feece572f574bb691a1b70cbd259320.mailgun.org>',
    method: 'POST',
    protocol: 'https:',
    hostname: 'api.mailgun.net',
    domain: 'sandboxa4433283cbc541fbb8afd6fe5218ef86.mailgun.org',
    auth: 'api:3f211abcbd5dd2d7ca542298c1b60fc6-059e099e-b23b0c8e',
    privateApiKey: '3f211abcbd5dd2d7ca542298c1b60fc6-059e099e-b23b0c8e',
    defaultPassword: '3db40fe7f92160d3bd0bc0526984e5db-059e099e-70e3a7bb',
    path: '/v3/sandboxa4433283cbc541fbb8afd6fe5218ef86.mailgun.org/messages'
  },

  mailGunHost: 'api.mailgun.net',
  mailGunPath:
    '/v3/sandbox5feece572f574bb691a1b70cbd259320.mailgun.org/messages',
  mailGunName: 'api',
  mailGunPassword: 'ec8c25dab4b473d172c31e31efd7cf86-4412457b-7fd23c96',
  mailGunFrom:
    'Mailgun Sandbox <postmaster@sandbox5feece572f574bb691a1b70cbd259320.mailgun.org>',
  mailGunMethod: 'POST'
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
