const winston = require('winston'),
  keys = require('./keys');
require('winston-mongodb');

//winston.add(new winston.transports.MongoDB());
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.MongoDB({
      db: keys.mongoUri,
      collection: 'errors',
      level: 'info'
    })
  ]
});

module.exports = logger;
