'use strict';

class Applicationutil {
  static makeMsg(status, msg, result) {
    return {
      status,
      success: status < 400,
      msg,
      result,
    };
  }
}

module.exports = Applicationutil;
