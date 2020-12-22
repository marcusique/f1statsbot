const libObj = {},
  infoLogger = require('../middleware/infoLogger'),
  errorLogger = require('../middleware/errorLogger'),
  dateFormat = require('dateformat');

libObj.returnDate = (unixTimestamp) => {
  return new Date(unixTimestamp * 1000);
};

libObj.logEvent = (logType, chatId, username, firstName, lastName, messageId, message, date, error) => {
  if ((logType = 'info')) {
    infoLogger.log({
      level: logType,
      message: `${dateFormat(
        new Date(date * 1000),
        'default'
      )}; CHAT_ID: ${chatId}; MESSAGE_ID: ${messageId}; MESSAGE: ${message} USERNAME: ${username}; FIRST_NAME: ${firstName}; LAST_NAME: ${lastName}`,
    });
  } else if ((logType = 'error')) {
    errorLogger.log({
      level: logType,
      message: `${dateFormat(
        returnDate(date),
        'default'
      )}; ERROR_MSG: ${error} CHAT_ID: ${chatId}; MESAGE_ID: ${messageId}; MESSAGE: ${message} USERNAME: ${username}; FIRST_NAME ${firstName}; LAST_NAME: ${lastName}`,
    });
  } else {
    console.log('Error occured in the logger.');
  }
};

module.exports = libObj;
