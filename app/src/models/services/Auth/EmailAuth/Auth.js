'use strict';

const crypto = require('crypto');
const EmailAuthStorage = require('./EmailAuthStorage');

class Auth {
  constructor(req) {
    this.req = req;
    this.body = req.body;
  }

  static async createToken(id) {
    try {
      // 토큰 생성
      const token = crypto.randomBytes(30).toString('hex').slice(0, 30);
      const student = {
        token,
        id,
      };

      // redis -> 토큰, 아이디, 유효시간 설정
      const isSave = await EmailAuthStorage.saveToken(student);

      if (isSave) return { success: true, token };
      return {
        success: false,
        msg: '서버 에러입니다. 서버개발자에게 문의하세요.',
      };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }
}

module.exports = Auth;
