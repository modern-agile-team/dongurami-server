'use strict';

const Home = require('../../models/services/CircleHome/home');

const process = {
  findOneByClubNum: async (req, res) => {
    const home = new Home(req);
    const response = await home.findOneByClubNum();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(404).json(response); // 존재하는 동아리가 없을 시 -> 파라미터를 건들여 접속한 경우
    // 회원가입이 되어 있지 않을때 나와야 하는 오류 -> 토큰 만들어 진 후 수정 예정
  },

  updateClubInfo: async (req, res) => {
    const home = new Home(req);
    const response = await home.saveClub();

    if (response) {
      return res.status(204).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(500).json(response);
    // 수정 권한이 없는 사람이 수정을 요청했을 때 생기는 오류 -> 토큰 만들어 진 후 수정 예정
  },
};

module.exports = {
  process,
};
