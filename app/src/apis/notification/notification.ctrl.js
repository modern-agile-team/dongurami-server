'use strict';

const Notification = require('../../models/services/Notification/Notification');

const process = {
  findAllById: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.findAllById();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(400).json(response);
  },

  updateOneByNotificationNum: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.updateOneByNotificationNum();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(400).json(response);
  },

  updateAllById: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.updateAllById();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(400).json(response);
  },
};

module.exports = { process };
