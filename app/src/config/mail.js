'use strict';

module.exports = {
  host: process.env.MAIL_HOST, // SMTP 서버 주소
  secure: true, // 보안 서버 사용 false로 적용시 port 옵션 추가 필요
  auth: {
    user: process.env.MAIL_SENDER, // 메일서버 계정
    pass: process.env.MAIL_EMAIL_PASSWORD, // 메일서버 비번
  },
};
