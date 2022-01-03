'use strict';

const Notification = require('../../models/services/Notification/Notification');
const logger = require('../../config/logger');

const process = {
  createNoticeBoardNotification: async (req, res) => {
    const { category } = req.params;
    const { boardNum } = req.params;
    const notification = new Notification(req);
    const response = await notification.createBoardNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/${category}/${boardNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(
      `POST /api/notification/${category}/${boardNum} 200: ${response.msg}`
    );
    return res.status(200).json(response);
  },

  createClubBoardNotification: async (req, res) => {
    const { category } = req.params;
    const { boardNum } = req.params;
    const { clubNum } = req.params;
    const notification = new Notification(req);
    const response = await notification.createBoardNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/${category}/${clubNum}/${boardNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(
      `POST /api/notification/${category}/${clubNum}/${boardNum} 200: ${response.msg}`
    );
    return res.status(200).json(response);
  },

  findAllById: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.findAllById();

    if (response.success) {
      logger.info(`GET /api/notification/entire 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `GET /api/notification/entire 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`GET /api/notification/entire 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  updateOneByNotificationNum: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.updateOneByNotificationNum();
    const { notificationNum } = req.params;

    if (response.success) {
      logger.info(
        `PATCH /api/notification/${notificationNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PATCH /api/notification/${notificationNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `PATCH /api/notification/${notificationNum} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  updateAllById: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.updateAllById();
    const { notificationNum } = req.params;

    if (response.success) {
      logger.info(
        `PUT /api/notification/${notificationNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PUT /api/notification/${notificationNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `PUT /api/notification/${notificationNum} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },
};

module.exports = { process };
