'use strict';

const Review = require('../../models/services/Review/Review');
const Auth = require('../../models/services/Auth/Auth');

const process = {
  // 테스트를 위해 임의로 token 생성.
  createToken: (req, res) => {
    const token = Auth.createToken(req.body);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, msg: 'JWT가 존재하지 않습니다.' });
    }
    return res
      .status(201)
      .json({ success: true, msg: 'JWT가 생성되었습니다.', token });
  },

  createByClubNum: async (req, res) => {
    const review = new Review(req);
    const response = await review.createByClubNum();
    return res.status(201).json(response);
  },
};

module.exports = {
  process,
};
