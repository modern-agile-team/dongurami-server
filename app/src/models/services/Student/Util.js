'use strict';

const bcrypt = require('bcrypt');
const StudentStorage = require('./StudentStorage');
const makeResponse = require('../../utils/makeResponse');
const Error = require('../../utils/Error');

class Util {
  static idOrPasswordNullCheck(client) {
    return client.id && client.password;
  }

  static idOrEmailNullCheck(client) {
    return client.name && client.email;
  }

  static comparePassword(inputPassword, storedPassword) {
    return bcrypt.compareSync(inputPassword, storedPassword);
  }

  static createHash(password) {
    const passwordSalt = bcrypt.genSaltSync(this.SALT_ROUNDS);
    const hash = bcrypt.hashSync(password, passwordSalt);

    return {
      passwordSalt,
      hash,
    };
  }

  static async checkByChangePassword(client) {
    if (!client.newPassword.length) {
      return makeResponse(400, '비밀번호를 입력해주세요.');
    }
    if (client.newPassword.length < 8) {
      return makeResponse(400, '비밀번호가 8자리수 미만입니다.');
    }
    if (client.newPassword !== client.checkNewPassword) {
      return makeResponse(400, '비밀번호와 비밀번호확인이 일치하지 않습니다.');
    }
    return { success: true };
  }

  static async checkExistIdAndEmail(client) {
    try {
      const registeredId = await StudentStorage.findOneById(client.id);
      if (!registeredId) return makeResponse(400, '가입된 아이디가 아닙니다.');

      const registeredEmail = await StudentStorage.findOneByEmail(client.email);
      if (!registeredEmail) {
        return makeResponse(400, '가입된 이메일이 아닙니다.');
      }
      if (registeredId.email !== registeredEmail.email) {
        return makeResponse(400, '아이디 또는 이메일이 일치하지 않습니다.');
      }
      return makeResponse(200, '계정 확인 성공', {
        name: registeredId.name,
      });
    } catch (err) {
      throw err;
    }
  }

  static async checkIdAndEmail(client) {
    const clientInfo = {
      id: client.id,
      email: client.email,
    };

    try {
      const student = await StudentStorage.findOneByIdOrEmail(clientInfo);

      if (student) {
        if (student.id === client.id) {
          return makeResponse(409, '이미 가입된 학번입니다.');
        }
        if (student.email === client.email) {
          return makeResponse(409, '이미 가입된 이메일입니다.');
        }
      }
      return { success: true };
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  static async checkPassword(clientInfo) {
    const { client, auth } = clientInfo;

    try {
      const student = await StudentStorage.findOneById(auth.id);

      if (Util.comparePassword(client.password, student.password)) {
        if (client.newPassword.length < 8) {
          return makeResponse(400, '비밀번호가 8자리수 미만입니다.');
        }
        if (client.password === client.newPassword) {
          return makeResponse(
            400,
            '기존 비밀번호와 다른 비밀번호를 설정해주세요.'
          );
        }
        if (client.newPassword === client.checkNewPassword) {
          return { success: true, student };
        }
        return makeResponse(400, '비밀번호가 일치하지 않습니다.');
      }
      return makeResponse(400, '기존 비밀번호가 틀렸습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Util;
