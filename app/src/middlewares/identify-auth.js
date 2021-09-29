'use strcit';

const loginCheck = require('./login-auth');

const identityCheck = (req, res, next) => {
  const token = req.headers['x-auth-token'];

  // token 존재 -> 로그인 / 임의토큰
  if (token !== undefined) {
    loginCheck.loginCheck(req, res, next);
  } else next();
};

module.exports = {
  identityCheck,
};
