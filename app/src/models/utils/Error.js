'use strict';

class Error {
  static ctrl(msg, err) {
    return {
      isError: true,
      errMsg: err,
      clientMsg: '서버 에러입니다. 서버 개발자에게 문의해 주세요.',
    };
  }

  static dbError() {
    return {
      isError: true,
      errMsg: new Error('DB접근중 알수없는 에러'),
      clientMsg:
        'DB접근중 알수없는 에러가 발생했습니다. 서버 개발자에게 문의해 주세요',
    };
  }
}

module.exports = Error;
