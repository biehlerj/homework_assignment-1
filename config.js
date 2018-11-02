/*
 * Creating and exporting configuration variables
*/

// Creating environmental variables container
var environments = {};

// Staging (default environment)
environments.staging = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'staging'
};

// Production environment
environments.production = {
  'httpPort': 80,
  'httpsPort': 443,
  'envName': 'production'
};

// Determining which environment was passed as a command-line argument
var currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment variable is one of the above environments, if not, default to staging
var environmentToExport = typeof (environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

// Exporting the module
module.exports = environmentToExport;
