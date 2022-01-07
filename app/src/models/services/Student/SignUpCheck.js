'use strict';

class SignUpCheck {
  static makeResponseMsg(status, msg) {
    return {
      success: status < 400,
      status,
      msg: `${msg}형식을 확인해주세요.`,
    };
  }

  static idCheck(infoCategory) {
    const ID_REGEXP = /^\d{9}$/;
    return ID_REGEXP.test(infoCategory[0]);
  }

  static passwordCheck(infoCategory) {
    const PASSWORD_REGEXP = /^[0-9a-zA-Z$@$!%*#?&]{8,}$/;
    return PASSWORD_REGEXP.test(infoCategory[1]);
  }

  static nameCheck(infoCategory) {
    const NAME_REGEXP = /^[가-힣-a-zA-Z]+$/;
    return NAME_REGEXP.test(infoCategory[2]);
  }

  static emailCheck(infoCategory) {
    const EMAIL_REGEXP =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return EMAIL_REGEXP.test(infoCategory[3]);
  }

  static majorCheck(infoCategory) {
    return infoCategory[4];
  }

  static infoCheck(saveInfo) {
    const infoCategory = Object.values(saveInfo);

    if (!SignUpCheck.idCheck(infoCategory)) {
      return SignUpCheck.makeResponseMsg(400, '아이디');
    }
    if (!SignUpCheck.passwordCheck(infoCategory)) {
      return SignUpCheck.makeResponseMsg(400, '비밀번호');
    }
    if (!SignUpCheck.nameCheck(infoCategory)) {
      return SignUpCheck.makeResponseMsg(400, '이름');
    }
    if (!SignUpCheck.emailCheck(infoCategory)) {
      return SignUpCheck.makeResponseMsg(400, '이메일');
    }
    if (!SignUpCheck.majorCheck(infoCategory)) {
      return SignUpCheck.makeResponseMsg(400, '학과');
    }
    return { success: true };
  }
}

module.exports = SignUpCheck;
