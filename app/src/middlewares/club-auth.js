'use strict';

module.exports.joined = (req, res, next) => {
  const paramsClubNum = req.params.clubNum;
  const token = req.headers['x-auth-token'] || '';
  const clubs = token.clubNum;

  if (!clubs.includes(paramsClubNum) || clubs.length === 0) {
    return res
      .status(201)
      .json({ success: false, msg: '해당 동아리에 가입하지 않았습니다.' });
  }

  req.clubNum = paramsClubNum;

  return next();
};

module.exports.notJoined = (req, res, next) => {
  const paramsClubNum = req.params.clubNum;
  const token = req.headers['x-auth-token'] || '';
  const clubs = token.clubNum;

  if (!clubs.includes(paramsClubNum) || clubs.length === 0) {
    return next();
  }

  return res
    .status(403)
    .json({ success: false, msg: '해당 접근이 불가능합니다.' });
};
