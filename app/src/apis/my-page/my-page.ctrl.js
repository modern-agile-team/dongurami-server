'use strict';

const MyPage = require('../../models/services/MyPage/MyPage');
const logger = require('../../config/logger');

const process = {
  findAllScrapsAndMyPagePosts: async (req, res) => {
    const myPage = new MyPage(req);
    const { id } = req.params;
    const { clubNum } = req.params;
    const response = await myPage.findAllScrapsAndMyPagePosts();

    if (response.success) {
      logger.info(
        `GET /api/my-page/${id}/personal/${clubNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `GET /api/my-page/${id}/personal/${clubNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    if (response.msg === '본인만 열람 가능합니다.') {
      logger.error(
        `GET /api/my-page/${id}/personal/${clubNum} 403: ${response.msg}`
      );
      return res.status(403).json(response);
    }
    logger.error(
      `GET /api/my-page/${id}/personal/${clubNum} 404: ${response.msg}`
    );
    return res.status(404).json(response);
  },

  findAllBoardsAndComments: async (req, res) => {
    const myPage = new MyPage(req);
    const { id } = req.params;
    const response = await myPage.findAllBoardsAndComments();

    if (response.success) {
      logger.info(`GET /api/my-page/${id}/my-post 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `GET /api/my-page/${id}/my-post 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`GET /api/my-page/${id}/my-post 403: ${response.msg}`);
    return res.status(403).json(response);
  },

  findOneScrap: async (req, res) => {
    const myPage = new MyPage(req);
    const { id } = req.params;
    const { clubNum } = req.params;
    const { scrapNum } = req.params;
    const response = await myPage.findOneScrap();

    if (response.success) {
      logger.info(
        `GET /api/my-page/${id}/personal/scrap/${clubNum}/${scrapNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `GET /api/my-page/${id}/personal/scrap/${clubNum}/${scrapNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `GET /api/my-page/${id}/personal/scrap/${clubNum}/${scrapNum} 404: ${response.msg}`
    );
    return res.status(404).json(response);
  },

  createScrapNum: async (req, res) => {
    const myPage = new MyPage(req);
    const { category } = req.params;
    const { clubNum } = req.params;
    const { boardNum } = req.params;
    const response = await myPage.createScrapNum();

    if (response.success) {
      logger.info(
        `POST /api/club/board/${category}/personal/scrap/${clubNum}/${boardNum} 201: ${response.msg}`
      );
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(
        `POST /api/club/board/${category}/personal/scrap/${clubNum}/${boardNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `POST /api/club/board/${category}/personal/scrap/${clubNum}/${boardNum} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  updateOneByScrapNum: async (req, res) => {
    const myPage = new MyPage(req);
    const { id } = req.params;
    const { clubNum } = req.params;
    const { scrapNum } = req.params;
    const response = await myPage.updateOneByScrapNum();

    if (response.success) {
      logger.info(
        `PUT /api/my-page/${id}/personal/scrap/${clubNum}/${scrapNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PUT /api/my-page/${id}/personal/scrap/${clubNum}/${scrapNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `PUT /api/my-page/${id}/personal/scrap/${clubNum}/${scrapNum} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  deleteOneByScrapNum: async (req, res) => {
    const myPage = new MyPage(req);
    const { id } = req.params;
    const { clubNum } = req.params;
    const { scrapNum } = req.params;
    const response = await myPage.deleteOneByScrapNum();

    if (response.success) {
      logger.info(
        `DELETE /api/my-page/${id}/personal/scrap/${clubNum}/${scrapNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `DELETE /api/my-page/${id}/personal/scrap/${clubNum}/${scrapNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response);
    }
    logger.error(
      `DELETE /api/my-page/${id}/personal/scrap/${clubNum}/${scrapNum} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  deleteOneByJoinedClub: async (req, res) => {
    const myPage = new MyPage(req);
    const { id } = req.params;
    const { clubNum } = req.params;
    const response = await myPage.deleteOneByJoinedClub();

    if (response.success) {
      logger.info(
        `DELETE /api/my-page/${id}/personal/${clubNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `DELETE /api/my-page/${id}/personal/${clubNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `DELETE /api/my-page/${id}/personal/${clubNum} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};
