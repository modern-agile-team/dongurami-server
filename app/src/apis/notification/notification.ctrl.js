'use strict';

const Notification = require('../../models/services/Notification/Notification');
const logger = require('../../config/logger');

const process = {
  createNoticeBoardNotification: async (req, res) => {
    const { boardNum } = req.params;
    const notification = new Notification(req);
    const response = await notification.createNoticeBoardNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/${boardNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(`POST /api/notification/${boardNum} 200: ${response.msg}`);
    return res.status(200).json(response);
  },

  createClubBoardNotification: async (req, res) => {
    const { boardNum } = req.params;
    const { clubNum } = req.params;
    const notification = new Notification(req);
    const response = await notification.createClubBoardNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/${clubNum}/${boardNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(
      `POST /api/notification/${clubNum}/${boardNum} 200: ${response.msg}`
    );
    return res.status(200).json(response);
  },

  createCmtNotification: async (req, res) => {
    const { boardNum } = req.params;
    const notification = new Notification(req);
    const response = await notification.createCmtNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/cmt/${boardNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(`POST /api/notification/cmt/${boardNum} 200: ${response.msg}`);
    return res.status(200).json(response);
  },

  createReplyCmtNotification: async (req, res) => {
    const { boardNum } = req.params;
    const { cmtNum } = req.params;
    const notification = new Notification(req);
    const response = await notification.createReplyCmtNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/cmt/${boardNum}/${cmtNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(
      `POST /api/notification/reply-cmt/${boardNum}/${cmtNum} 200: ${response.msg}`
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
