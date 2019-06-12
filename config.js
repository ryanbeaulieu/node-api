// Create and export configuration variable

let environments = {};

// Defaults to staging
environments.staging = {
    'httpPort': '3000',
    'httpsPort': '3001',
    'envName': 'staging'
};

environments.production = {
    'httpPort': '5000',
    'httpsPort': '5001',
    'envName': 'production'
};

// Determine which object to export (staging or production)
let currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check if passed environment is valid and set the environment
let envToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments['staging'];

module.exports = envToExport;