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
        `POST /api/notification/board/notice/${boardNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(
      `POST /api/notification/board/notice/${boardNum} 201: ${response.msg}`
    );
    return res.status(200).json(response);
  },

  createClubNoticeNotification: async (req, res) => {
    const { boardNum } = req.params;
    const { clubNum } = req.params;
    const notification = new Notification(req);
    const response = await notification.createClubNoticeBoardNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/board/club-notice/${clubNum}/${boardNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(
      `POST /api/notification/board/club-notice/${clubNum}/${boardNum} 201: ${response.msg}`
    );
    return res.status(200).json(response);
  },

  createCmtNotification: async (req, res) => {
    const { boardNum } = req.params;
    const { category } = req.params;
    const notification = new Notification(req);
    const response = await notification.createCmtNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/comment/${category}/${boardNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(
      `POST /api/notification/comment/${category}/${boardNum} 201: ${response.msg}`
    );
    return res.status(200).json(response);
  },

  createReplyCmtNotification: async (req, res) => {
    const { boardNum } = req.params;
    const { cmtNum } = req.params;
    const { category } = req.params;
    const notification = new Notification(req);
    const response = await notification.createReplyCmtNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/reply-comment/${category}/${boardNum}/${cmtNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(
      `POST /api/notification/reply-comment/${category}/${boardNum}/${cmtNum} 201: ${response.msg}`
    );
    return res.status(200).json(response);
  },

  createLikeNotificationByBoardNum: async (req, res) => {
    const { boardNum } = req.params;
    const { category } = req.params;
    const notification = new Notification(req);
    const response = await notification.createLikeNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/like/board/${category}/${boardNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(
      `POST /api/notification/like/board/${category}/${boardNum} 201: ${response.msg}`
    );
    return res.status(200).json(response);
  },

  createLikeNotificationByCmtNum: async (req, res) => {
    const { cmtNum } = req.params;
    const { category } = req.params;
    const notification = new Notification(req);
    const response = await notification.createLikeNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/like/comemnt/${category}/${cmtNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(
      `POST /api/notification/like/comment/${category}/${cmtNum} 201: ${response.msg}`
    );
    return res.status(200).json(response);
  },

  createLikeNotificationByReplyCmtNum: async (req, res) => {
    const { ReplyCmtNum } = req.params;
    const { category } = req.params;
    const notification = new Notification(req);
    const response = await notification.createLikeNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/like/reply-comment/${category}/${ReplyCmtNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(
      `POST /api/notification/like/reply-comment/${category}/${ReplyCmtNum} 201: ${response.msg}`
    );
    return res.status(200).json(response);
  },

  createJoinNotification: async (req, res) => {
    const { clubNum } = req.params;
    const { applicant } = req.params;
    const notification = new Notification(req);
    const response = await notification.createJoinNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/join-club/result/${clubNum}/${applicant} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(
      `POST api/notification/join-club/result/${clubNum}/${applicant} 201: ${response.msg}`
    );
    return res.status(200).json(response);
  },

  createScheduleNotification: async (req, res) => {
    const { clubNum } = req.params;
    const notification = new Notification(req);
    const response = await notification.createScheduleNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/schedule/${clubNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(
      `POST /api/notification/schedule/${clubNum} 201: ${response.msg}`
    );
    return res.status(200).json(response);
  },

  createClubResignNotification: async (req, res) => {
    const { clubNum } = req.params;
    const notification = new Notification(req);
    const response = await notification.createClubResignNotification();

    if (response.isError) {
      logger.error(
        `POST /api/notification/club-resign/${clubNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.info(
      `POST /api/notification/club-resign/${clubNum} 201: ${response.msg}`
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
