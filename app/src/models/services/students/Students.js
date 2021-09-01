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
          return { success: true, msg: '회원가입성공' };
        }
        return { success: false, msg: '알수 없는 에러' };
      }
      if (inspector.id === client.id) {
        return { saveable: false, msg: '이미 등록된 아이디입니다.' };
      }
      if (inspector.email === client.email) {
        return { saveable: false, msg: '이미 등록된 이메일입니다.' };
      }
      return { success: false, msg: '알수 없는 에러' };
    } catch (err) {
      return { success: false, msg: '외안되?' };
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
