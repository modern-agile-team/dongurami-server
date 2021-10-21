'use strict';

const Notification = require('../../models/services/Notification/Notification');
const logger = require('../../config/logger');

const process = {
  findAllById: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.findAllById();

    if (response.success) {
      logger.info(`GET /api/notification/entire 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`GET /api/notification/entire 500: \n${response.errMsg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`GET /api/notification/entire 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  updateOneByNotificationNum: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.updateOneByNotificationNum();

    if (response.success) {
      logger.info(
        `PATCH /api/notification/${notificationNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PATCH /api/notification/${notificationNum} 500: \n${response.errMsg}`
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

    if (response.success) {
      logger.info(
        `PUT /api/notification/${notificationNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PUT /api/notification/${notificationNum} 500: \n${response.errMsg}`
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
