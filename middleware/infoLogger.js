const winston = require('winston'),
  appRoot = require('app-root-path');

const infoLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    // new winston.transports.MongoDB({
    //   db: keys.mongoUri,
    //   collection: 'info',
    //   level: 'info'
    // })
    new winston.transports.File({
      level: 'info',
      filename: `${appRoot}/logs/info.log`
    })
  ]
});

module.exports = infoLogger;
