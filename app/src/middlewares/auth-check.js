const Auth = require('../models/services/Auth/Auth');

module.exports.loggined = (req, res, next) => {
  const token = req.headers['x-auth-token'] || '';

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

  // 클라이언트가 임의로 token을 입력했을 때!
  if (auth.err === undefined) {
    return res
      .status(401)
      .json({ success: false, msg: '유효하지 않는 토큰입니다.' });
  }
  return next();
};

module.exports.notLoggined = (req, res, next) => {
  const token = req.headers['x-auth-token'] || '';

  if (token.length === 0) return next();

  const auth = Auth.verifyJWT(token);

  if (auth.err === 'jwt expired' || auth.err === 'invalid token') return next();

  // 로그인이 안된 상황에서 유효한 토큰으로 접근하려는 경우
  return res
    .status(403)
    .json({ success: false, msg: '이미 로그인 되어있습니다.' });
};
