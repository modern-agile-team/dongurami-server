'use strict';

const MyPage = require('../../models/services/MyPage/MyPage');

const process = {
  findAllScrapsByClubNum: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.findAllScrapsByClubNum();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(404).json(response);
  },

  findOneScrap: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.findOneScrap();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(404).json(response);
  },

  createScrapNum: async (req, res) => {
    const board = new MyPage(req);
    const response = await board.createScrapNum();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(400).json(response);
  },

  updateOneByScrapNum: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.updateOneByScrapNum();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(400).json(response);
  },

  deleteOneByScrapNum: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.deleteOneByScrapNum();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response);
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};
