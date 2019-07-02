const winston = require('winston'),
  keys = require('../config/keys');
require('winston-mongodb');

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.MongoDB({
      db: keys.mongoUri,
      collection: 'errors',
      level: 'error'
    })
  ]
});

module.exports = errorLogger;
