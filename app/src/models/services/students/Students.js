'use strict';

const StudentStorage = require('./StudentStorage');

class Student {
  constructor(body) {
    this.body = body;
  }

  // async list() {
  //   const client = this.body;
  //   const student = await StudentStorage.getStudentInfo(client.id);
  //   console.log(student);
  // }

  // async login() {
  //   const client = this.body;
  //   const student = await StudentStorage.findOneById(client.id);
  //   if (student) {
  //     if (student.id === client.id && student.password === client.password) {
  //       return { success: true };
  //     }
  //     return { success: false, msg: 'password wrong' };
  //   }
  //   return { success: false, msg: 'not user' };
  // }

  async signup() {
    const client = this.body;
    try {
      const inspector = await this.inspectIdAndEmail();

      if (inspector === undefined) {
        const response = await StudentStorage.save(client);
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
