'use strict';

const logger = require('../config/logger');

const clubJoinCheck = (req, res, next) => {
  const paramsClubNum = Number(req.params.clubNum);
  const clubs = req.auth.clubNum;

  if (!clubs.includes(paramsClubNum) || clubs.length === 0) {
    logger.error(
      `club-join-check 403: JWT 토큰이 존재하지 않습니다. 로그인 후 이용해주세요.`
    );
    return res
      .status(403)
      .json({ success: false, msg: '해당 동아리에 가입하지 않았습니다.' });
  }

  return next();
};

module.exports = { clubJoinCheck };
