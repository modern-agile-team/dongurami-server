'use strict';

const MyPage = require('../../models/services/MyPage/MyPage');
const logger = require('../../config/logger');

const process = {
  findAllScrapsByClubNum: async (req, res) => {
    const myPage = new MyPage(req);
    const { id } = req.body;
    const { clubNum } = req.body;
    const response = await myPage.findAllScrapsByClubNum();

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
    logger.error(
      `GET /api/my-page/${id}/personal/${clubNum} 404: ${response.msg}`
    );
    return res.status(404).json(response);
  },

  findOneScrap: async (req, res) => {
    const myPage = new MyPage(req);
    const { id } = req.body;
    const { clubNum } = req.body;
    const { scrapNum } = req.body;
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
    const board = new MyPage(req);
    const { category } = req.body;
    const { clubNum } = req.body;
    const { boardNum } = req.body;
    const response = await board.createScrapNum();

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
    const { id } = req.body;
    const { clubNum } = req.body;
    const { scrapNum } = req.body;
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
    const { id } = req.body;
    const { clubNum } = req.body;
    const { scrapNum } = req.body;
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
};

module.exports = {
  process,
};
