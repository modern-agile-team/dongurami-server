'use strict';

const nodemailer = require('nodemailer');
const Student = require('../Student/Student');
const EmailAuth = require('../Auth/EmailAuth/EmailAuth');
const Error = require('../../utils/Error');
const mailConfig = require('../../../config/mail');

const { CHANGE_PASSWORD_URL } = process.env;

class Email {
  constructor(req) {
    this.req = req;
    this.body = req.body;
  }

  async sendEmailForPassword() {
    const client = this.body;

    try {
      const existInfo = await Student.isExistIdAndEmail(client);

      if (!existInfo.isExist) return existInfo;

      const tokenInfo = await EmailAuth.createToken(client.id);

      if (!tokenInfo.success) return tokenInfo;

      const message = {
        from: process.env.MAIL_SENDER,
        to: client.email,
        subject: `${existInfo.name}님, 동그라미에서 보낸 메일입니다.`,
        html: `<p>안녕하십니까, <b>${existInfo.name}</b>님.<br> 비밀번호를 변경하시려면 <a href="${CHANGE_PASSWORD_URL}/${tokenInfo.token}">링크</a>를 눌러주세요</p>`,
      };

      const transporter = nodemailer.createTransport(mailConfig);
      // 메일 전송
      transporter.sendMail(message);
      return {
        success: true,
        msg: '성공적으로 메일을 발송했습니다.',
        token: tokenInfo.token,
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
