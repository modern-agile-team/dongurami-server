const Auth = require('../models/services/Auth/Auth');

module.exports.loggined = (req, res, next) => {
  const token = req.headers['x-auth-token'];

  if (token.length === 0) {
    return res
      .status(401)
      .json({ success: false, msg: 'JWT 토큰이 존재하지 않습니다.' });
  }

  const auth = Auth.verifyJWT(token);

  if (auth.err === 'jwt expired') {
    return res
      .status(401)
      .json({ suceess: false, msg: '유효 시간이 만료된 토큰입니다.' });
  }

  if (auth.err === 'invalid token') {
    return res
      .status(401)
      .json({ success: false, msg: '유효하지 않는 토큰입니다.' });
  }

  // if (auth.id === 'undefined')
  return next();
};
