const winston = require('winston'),
  keys = require('../config/keys'),
  appRoot = require('app-root-path');
require('winston-mongodb');

const infoLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.MongoDB({
      db: keys.mongoUri,
      collection: 'info',
      level: 'info'
    })
    // new winston.transports.File({
    //   level: 'info',
    //   filename: `${appRoot}/logs/info.log`
    // })
  ]
});

module.exports = infoLogger;
