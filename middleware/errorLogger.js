const winston = require('winston'),
  keys = require('../config/keys');

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      level: 'error',
      filename: keys.appErrorLogPath,
      timestamp: true,
      handleExceptions: true
    })
  ]
});

module.exports = errorLogger;
