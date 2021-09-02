'use strict';

// const mariadb = require('../../config/mariadb');
const Home = require('../../models/services/CircleHome/home');

const process = {
  findOneByClubNum: async (req, res) => {
    const home = new Home(req);
    const response = await home.findOneByClubNum();
    if (response.success) {
      return res.status(200).json(response);
    }
    // 회원가입이 되어 있지 않을때 나와야 하는 오류 -> 토큰 만들어 진 후 수정예정
    return res.status(404).json(response);
  },
  updateClubInfo: async (req, res) => {
    const home = new Home(req);
    const response = await home.saveClub();
    if (response) {
      return res.status(204).json(response);
    }
    return res.status(500).json(response);
  },
};

module.exports = {
  process,
};
