'use strict';

const clubJoinCheck = (req, res, next) => {
  const paramsClubNum = Number(req.params.clubNum);
  const clubs = req.auth.clubNum;

  if (!clubs.includes(paramsClubNum) || clubs.length === 0) {
    return res
      .status(201)
      .json({ success: false, msg: '해당 동아리에 가입하지 않았습니다.' });
  }

  return next();
};

module.exports = { clubJoinCheck };
