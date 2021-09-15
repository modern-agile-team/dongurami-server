'use strict';

const Home = require('../../models/services/CircleHome/Home');

const process = {
  findOneByClubNum: async (req, res) => {
    const home = new Home(req);
    const response = await home.findOneByClubNum();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res.status(404).json(response); // 존재하는 동아리가 없을 시 -> 파라미터를 건들여 접속한 경우
  },

  updateClubInfo: async (req, res) => {
    const home = new Home(req);
    const response = await home.updateClubInfo();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res
      .status(400)
      .json({ success: false, msg: '서버 개발자에게 문의해주세요.' });
  },

  updateClubLogo: async (req, res) => {
    const home = new Home(req);
    const response = await home.updateClubLogo();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.errMsg });
    }
    return res
      .status(400)
      .json({ success: false, msg: '서버 개발자에게 문의해주세요.' });
  },
};

module.exports = {
  process,
};
