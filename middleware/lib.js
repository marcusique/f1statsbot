const libObj = {};

libObj.returnDate = unixTimestamp => {
  return new Date(unixTimestamp * 1000);
};

module.exports = libObj;
