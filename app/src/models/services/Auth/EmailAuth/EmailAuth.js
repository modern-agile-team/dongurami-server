'use strict';

const crypto = require('crypto');
const EmailAuthStorage = require('./EmailAuthStorage');

class EmailAuth {
  static makeResponseMsg(status, msg, extra) {
    const response = {
      success: status < 400,
      status,
      msg,
    };

    for (const info in extra) {
      if (Object.prototype.hasOwnProperty.call(extra, info)) {
        response[info] = extra[info];
      }
    }
    return response;
  }

  static async createToken(id) {
    try {
      const token = crypto.randomBytes(30).toString('hex');
      const student = {
        token,
        id,
      };
      const isSave = await EmailAuthStorage.saveToken(student);

      if (isSave) return { success: true, token };
      return { success: false };
    } catch (err) {
      throw err;
    }
  }

  static async checkByUseableToken(reqInfo) {
    try {
      const token = await EmailAuthStorage.findOneByStudentId(reqInfo.id);

      if (token === reqInfo.token) return { success: true };
      return EmailAuth.makeResponseMsg(
        403,
        '토큰이 유효하지 않거나 입력한 아이디와 일치하지 않습니다.'
      );
    } catch (err) {
      throw err;
    }
  }
}

module.exports = EmailAuth;
