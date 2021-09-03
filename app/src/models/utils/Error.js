'use strict';

class Error {
  static ctrl(msg, err) {
    return {
      isError: true,
      errMsg: err,
      clientMsg: msg,
    };
  }
}

module.exports = Error;
