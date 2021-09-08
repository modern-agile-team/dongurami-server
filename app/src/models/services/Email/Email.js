'use strict';

const StudentStorage = require('../Student/StudentStorage');
const Error = require('../../utils/Error');

class Email {
  constructor(body) {
    this.body = body;
  }

  async sendPasswordForLink() {
    const client = this.body;

    try {
      const studentInfoById = await StudentStorage.findOneById(client.id);
      if (!studentInfoById) {
        return { success: false, msg: '등록되지 않은 아이디입니다.' };
      }

      const studentInfoByEmail = await StudentStorage.findOneByEmail(
        client.email
      );
      if (!studentInfoByEmail) {
        return { success: false, msg: '등록되지 않은 이메일입니다.' };
      }

      if (studentInfoById.id !== studentInfoByEmail.id) {
        return { success: false, msg: '아이디와 이메일이 일치하지 않습니다.' };
      }
      return () => {
        try {
          const message = {
            from: process.env.MAIL_EMAIL,
            to: client.email,
            subject: `[동그라미] ${client.id}님 비밀번호 변경 링크가 도착했습니다.`,
            // html:
          };
          console.log(message);
        } catch (err) {
          //
        }
      };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }
}

module.exports = Email;
