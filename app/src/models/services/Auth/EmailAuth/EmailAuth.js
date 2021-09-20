'use strict';

const crypto = require('crypto');
const EmailAuthStorage = require('./EmailAuthStorage');
const Error = require('../../../utils/Error');

class Auth {
  constructor(req) {
    this.req = req;
    this.body = req.body;
  }

  static async createToken(id) {
    try {
      // 토큰 생성
      const token = crypto.randomBytes(30).toString('hex');
      const student = {
        token,
        id,
      };

      // redis -> 토큰, 아이디, 유효시간 설정
      const isSave = await EmailAuthStorage.saveToken(student);

      if (isSave) return { success: true, token };
      return { success: false, err };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }

  static async useableToken(reqInfo) {
    try {
      const token = await EmailAuthStorage.findOneByStudentId(reqInfo.id);

      if (token === reqInfo.params.token) {
        return { useable: true };
      }
      return {
        useable: false,
        msg: '미등록 토큰이거나 유효시간 (10분)이 만료된 토큰입니다.',
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
