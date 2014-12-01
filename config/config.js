var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
// var host = (process.env.VCAP_APP_HOST || 'localhost');


var config = {
  development: {
    root: rootPath,
    app: {
      name: 'mvc'
    },
    port: (process.env.VCAP_APP_PORT || 3000),
    db: 'mongodb://localhost/mvc-development'
    
  },

  test: {
    root: rootPath,
    app: {
      name: 'mvc'
    },
    port: (process.env.VCAP_APP_PORT || 3000),
    db: 'mongodb://localhost/mvc-test'
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'mvc'
    },
    port: (process.env.VCAP_APP_PORT || 3000),
    db: 'mongodb://localhost/mvc-production'
    
  }
};

module.exports = config[env];
