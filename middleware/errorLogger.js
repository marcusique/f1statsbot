const winston = require('winston'),
  appRoot = require('app-root-path');

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    // new winston.transports.MongoDB({
    //   level: 'error',
    //   db: keys.mongoUri,
    //   collection: 'errors'
    // })
    new winston.transports.File({
      level: 'error',
      filename: `${appRoot}/logs/errors.log`,
      timestamp: true,
      handleExceptions: true
    })
  ]
});

module.exports = errorLogger;
