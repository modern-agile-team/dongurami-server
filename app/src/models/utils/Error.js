'use strict';

class Error {
  static ctrl(msg, err) {
    return {
      isError: true,
      errMsg: err,
      clientMsg: '서버 에러입니다. 서버 개발자에게 문의해주세요.',
    };
  }
}

module.exports = Error;
