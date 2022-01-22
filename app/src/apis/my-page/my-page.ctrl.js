'use strict';

const MyPage = require('../../models/services/MyPage/MyPage');
const getApiInfo = require('../../models/utils/getApiInfo');
const processCtrl = require('../../models/utils/processCtrl');

const process = {
  findAllScrapsAndMyPagePosts: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.findAllScrapsAndMyPagePosts();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  findAllBoardsAndComments: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.findAllBoardsAndComments();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  findOneScrap: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.findOneScrap();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  createScrapNum: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.createScrapNum();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  updateOneByScrapNum: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.updateOneByScrapNum();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  deleteOneByScrapNum: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.deleteOneByScrapNum();
    const apiInfo = getApiInfo('DELETE', response, req);

    return processCtrl(res, apiInfo);
  },

  deleteOneByJoinedClub: async (req, res) => {
    const myPage = new MyPage(req);
    const response = await myPage.deleteOneByJoinedClub();
    const apiInfo = getApiInfo('DELETE', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = {
  process,
};
