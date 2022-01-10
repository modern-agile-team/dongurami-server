'use strict';

class SignUpCheck {
  static makeResponseMsg(status, msg) {
    return {
      success: status < 400,
      status,
      msg: `${msg}형식을 확인해주세요.`,
    };
  }

  static idCheck(id) {
    const ID_REGEXP = /^\d{9}$/;

    return ID_REGEXP.test(id);
  }

  static passwordCheck(password) {
    const PASSWORD_REGEXP = /^[0-9a-zA-Z$@$!%*#?&]{8,}$/;

    return PASSWORD_REGEXP.test(password);
  }

  static nameCheck(name) {
    const NAME_REGEXP = /^[가-힣-a-zA-Z]+$/;

    return NAME_REGEXP.test(name);
  }

  static emailCheck(email) {
    const EMAIL_REGEXP =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    return EMAIL_REGEXP.test(email);
  }

  static majorCheck(major) {
    return major;
  }

  static infoCheck(saveInfo) {
    const infoCategory = Object.values(saveInfo);

    if (!SignUpCheck.idCheck(infoCategory[0])) {
      return SignUpCheck.makeResponseMsg(400, '아이디');
    }
    if (!SignUpCheck.passwordCheck(infoCategory[1])) {
      return SignUpCheck.makeResponseMsg(400, '비밀번호');
    }
    if (!SignUpCheck.nameCheck(infoCategory[2])) {
      return SignUpCheck.makeResponseMsg(400, '이름');
    }
    if (!SignUpCheck.emailCheck(infoCategory[3])) {
      return SignUpCheck.makeResponseMsg(400, '이메일');
    }
    if (!SignUpCheck.majorCheck(infoCategory[4])) {
      return SignUpCheck.makeResponseMsg(400, '학과');
    }
    return { success: true };
  }
}

module.exports = SignUpCheck;
