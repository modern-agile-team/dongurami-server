'use strict';

const Notification = require('../../models/services/Notification/Notification');
const processCtrl = require('../../models/utils/processCtrl');
const getApiInfo = require('../../models/utils/getApiInfo');

const process = {
  createNoticeBoardNotification: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.createNoticeBoardNotification();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  createClubNoticeNotification: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.createClubNoticeBoardNotification();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  createCmtNotification: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.createCmtNotification();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  createReplyCmtNotification: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.createReplyCmtNotification();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  createLikeNotificationByBoardNum: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.createLikeNotification();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  createLikeNotificationByCmtNum: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.createLikeNotification();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  createLikeNotificationByReplyCmtNum: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.createLikeNotification();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  createJoinResultNotification: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.createJoinResultNotification();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  createJoinNotification: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.createJoinNotification();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  createScheduleNotification: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.createScheduleNotification();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  createClubResignNotification: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.createClubResignNotification();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  findAllById: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.findAllById();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  updateOneByNotificationNum: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.updateOneByNotificationNum();
    const apiInfo = getApiInfo('PATCH', response, req);

    return processCtrl(res, apiInfo);
  },

  updateAllById: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.updateAllById();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = { process };
