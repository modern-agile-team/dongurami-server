'use strict';

const Notification = require('../../models/services/Notification/Notification');

const process = {
  findAllById: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.findAllById();

    if (response.success) {
      logger.info(`GET /entire 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.info(`GET /entire 500:\n${response.errMsg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.info(`GET /entire 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  updateOneByNotificationNum: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.updateOneByNotificationNum();

    if (response.success) {
      logger.info(`PATCH /notificationNum 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.info(`PATCH /notificationNum 500: ${response.errMsg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.info(`PATCH /notificationNum 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  updateAllById: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.updateAllById();

    if (response.success) {
      logger.info(`PUT /notificationNum 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.info(`PUT /notificationNum 500: ${response.errMsg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.info(`PUT /notificationNum 400: ${response.msg}`);
    return res.status(400).json(response);
  },
};

module.exports = { process };
