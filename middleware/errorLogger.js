const winston = require('winston'),
  keys = require('../config/keys'),
  appRoot = require('app-root-path');
require('winston-mongodb');

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.MongoDB({
      level: 'error',
      db: keys.mongoUri,
      collection: 'errors'
    }),
    new winston.transports.File({
      level: 'error',
      filename: `${appRoot}/logs/errors.log`,
      timestamp: true,
      handleExceptions: true
    })
  ]
});

module.exports = errorLogger;
