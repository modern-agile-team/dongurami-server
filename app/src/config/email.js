const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
  service: 'Naver',
  auth: {
    user: 'wooahan-agile@naver.com',
    pass: 'agile123!',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  smtpTransport,
};
