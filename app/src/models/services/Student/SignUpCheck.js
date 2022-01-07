'use strict';

class SignUpCheck {
  static makeResponseMsg(status, msg) {
    return {
      success: status < 400,
      status,
      msg,
    };
  }

  static infoCheck(saveInfo) {
    const infoCategory = Object.values(saveInfo);
    const ID_REGEXP = /^\d{9}$/;
    const PASSWORD_REGEXP = /^[0-9a-zA-Z$@$!%*#?&]{8,}$/;
    const NAME_REGEXP = /^[가-힣-a-zA-Z]+$/;
    const EMAIL_REGEXP =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    if (!infoCategory[0].match(ID_REGEXP)) {
      return SignUpCheck.makeResponseMsg(400, '아이디 형식이 맞지 않습니다.');
    }
    if (!infoCategory[1].match(PASSWORD_REGEXP)) {
      return SignUpCheck.makeResponseMsg(400, '비밀번호 형식이 맞지 않습니다.');
    }
    if (!infoCategory[2].match(NAME_REGEXP)) {
      return SignUpCheck.makeResponseMsg(400, '이름 형식이 맞지 않습니다.');
    }
    if (!infoCategory[3].match(EMAIL_REGEXP)) {
      return SignUpCheck.makeResponseMsg(400, '이메일 형식이 맞지 않습니다.');
    }
    if (!infoCategory[4]) {
      return SignUpCheck.makeResponseMsg(400, '학과가 선택되지 않았습니다.');
    }
    return { success: true };
  }
}

module.exports = SignUpCheck;
