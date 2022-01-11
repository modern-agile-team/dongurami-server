'use strcit';

const loginCheck = require('./login-auth');

const identityCheck = (req, res, next) => {
  let token = req.headers['x-auth-token'] || '';

  if (token === 'null') token = '';

  if (token) loginCheck.loginCheck(req, res, next);
  else next();
};

module.exports = {
  identityCheck,
};
