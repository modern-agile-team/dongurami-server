'use strict';

const nodemailer = require('nodemailer');
const Student = require('../Student/Student');
const Auth = require('../Auth/EmailAuth/Auth');
const Error = require('../../utils/Error');
const mailConfig = require('../../../config/mail');

const { CHANGE_PASSWORD_URL } = process.env;

class Email {
  constructor(req) {
    this.req = req;
    this.body = req.body;
  }

  async sendLinkForPassword() {
    const client = this.body;

    try {
      const { req } = this;
      const student = new Student(req);

      // id, email 유효성 검사
      const existInfo = await student.isExistIdAndEmail();
      if (!existInfo.isExist) return existInfo;

      // 토큰 생성 함수로 이동
      const tokenInfo = await Auth.createToken(client.id);
      if (!tokenInfo.success) return tokenInfo;

      const message = {
        from: process.env.MAIL_SENDER,
        to: client.email, // 받는 사람 주소
        subject: `${existInfo.name}님, 동그라미에서 보낸 메일입니다.`, // 제목
        html: `<p>안녕하십니까, <b>${existInfo.name}</b>님.<br> 비밀번호를 변경하시려면 <a href="${CHANGE_PASSWORD_URL}/${tokenInfo.token}">링크</a>를 눌러주세요</p>`,
      };

      const transporter = nodemailer.createTransport(mailConfig);
      transporter.sendMail(message);
      return { success: true, msg: '성공적으로 메일을 발송했습니다.' };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }
}

module.exports = Email;
