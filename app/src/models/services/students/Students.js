'use strict';

const bcrypt = require('bcrypt');

const saltRounds = 10;
const StudentStorage = require('./StudentStorage');

class Student {
  constructor(body) {
    this.body = body;
  }

  async signup() {
    const client = this.body;
    const passwordSalt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(client.password, passwordSalt);
    try {
      const inspector = await this.inspectIdAndEmail();
      if (inspector === undefined) {
        const studentInfo = { client, passwordSalt, hash };
        const response = await StudentStorage.save(studentInfo);
        if (response) {
          return { success: true, msg: '회원가입에 성공하셨습니다.' };
        }
        return {
          success: false,
          msg: '회원가입에 실패하셨습니다. 서버 개발자에게 문의해주세요.',
        };
      }
      if (inspector.id === client.id) {
        return {
          saveable: false,
          msg: '이미 가입된 아이디입니다. 다른 아이디를 사용해주세요.',
        };
      }
      if (inspector.email === client.email) {
        return {
          saveable: false,
          msg: '이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.',
        };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    }
  }

  async inspectIdAndEmail() {
    const client = this.body;
    const student = await StudentStorage.checkIdAndEmail(
      client.id,
      client.email
    );
    return student;
  }
}

module.exports = Student;
