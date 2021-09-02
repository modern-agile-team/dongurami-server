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
    const inspector = await this.inspectIdAndEmail();

    if (inspector.saveable) {
      const studentInfo = { client, passwordSalt, hash };
      const response = await StudentStorage.save(studentInfo);

      if (response) {
        return { success: true, msg: '회원가입에 성공하셨습니다.' };
      }
    }
    return inspector;
  }

  async inspectIdAndEmail() {
    const client = this.body;
    const student = await StudentStorage.findOneByIdAndEmail(
      client.id,
      client.email
    );

    try {
      if (student === undefined) {
        return { saveable: true };
      }
      if (student.id === client.id) {
        return {
          saveable: false,
          msg: '이미 가입된 아이디입니다. 다른 아이디를 사용해주세요.',
        };
      }
      if (student.email === client.email) {
        return {
          saveable: false,
          msg: '이미 가입된 이메일입니다. 다른 이메일를 사용해주세요.',
        };
      }
    } catch (err) {
      return {
        saveable: false,
        msg: '알 수 없는 오류입니다. 서버개발자에게 문의하세요',
      };
    }
    return {
      saveable: false,
      msg: '서버 에러입니다. 서버개발자에게 문의하세요',
    };
  }
}

module.exports = Student;
