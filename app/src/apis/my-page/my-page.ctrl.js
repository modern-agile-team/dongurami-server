'use strict';

const MyPage = require('../../models/services/MyPage/MyPage');

const process = {
  findAllScraps: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.findAllScraps();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(400).json(response);
  },

  findAllScrapsBySubClub: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.findAllScrapsBySubClub();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};
