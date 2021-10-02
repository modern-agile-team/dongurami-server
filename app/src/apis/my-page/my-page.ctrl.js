'use strict';

const MyPage = require('../../models/services/MyPage/MyPage');

const process = {
  findAllScrapsByClubNum: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.findAllScrapsByClubNum();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(400).json(response);
  },

  findOneScrp: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.findOneScrap();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};
