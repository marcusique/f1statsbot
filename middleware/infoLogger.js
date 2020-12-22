const winston = require('winston'),
  keys = require('../config/keys');

const infoLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: keys.appEventLogPath,
      timestamp: true,
      handleExceptions: true
    })
  ]
});

module.exports = infoLogger;
