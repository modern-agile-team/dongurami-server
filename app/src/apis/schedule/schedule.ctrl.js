'use strict';

const Schedule = require('../../models/services/Schedule/Schedule');
const Notification = require('../../models/services/Notification/Notification');
const logger = require('../../config/logger');

const process = {
  findAllByClubNum: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.findAllByClubNum();

    if (response.success) {
      logger.error(`GET /api/club/schedule/clubNum 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`GET /api/club/schedule/clubNum 500: ${response.errMsg}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`GET /api/club/schedule/clubNum 404: ${response.msg}`);
    return res.status(404).json(response); // 존재하지 않는 동아리에 접근 시
  },

  findAllByDate: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.findAllByDate();

    if (response.success) {
      logger.error(`GET /api/club/schedule/clubNum/date 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `GET /api/club/schedule/clubNum/date 500: ${response.errMsg}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`GET /api/club/schedule/clubNum/date 404: ${response.msg}`);
    return res.status(404).json(response); // 존재하지 않는 동아리에 접근 시
  },

  createSchedule: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.createSchedule();

    if (response.success) {
      logger.error(`POST /api/club/schedule/clubNum 201: ${response.msg}`);
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(`POST /api/club/schedule/clubNum 500: ${response.errMsg}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`POST /api/club/schedule/clubNum 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  createTodayByIdAndClubName: async (req, res) => {
    const notification = new Notification(req);
    const response = await notification.createTodayByIdAndClubName();

    if (response.isError) {
      logger.error(
        `POST /api/club/schedule/clubNum/today 500: ${response.errMsg}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`POST /api/club/schedule/clubNum/today 201: ${response.msg}`);
    return res.status(201).json(response);
  },

  updateSchedule: async (req, res) => {
    // 일정 내용과 시간과 관련하여 수정 시
    const schedule = new Schedule(req);
    const response = await schedule.updateSchedule();

    if (response.success) {
      logger.error(`PUT /api/club/schedule/clubNum/no 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`PUT /api/club/schedule/clubNum/no 500: ${response.errMsg}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`PUT /api/club/schedule/clubNum/no 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  updateOnlyImportant: async (req, res) => {
    // 일정 중요도 수정
    const schedule = new Schedule(req);
    const response = await schedule.updateOnlyImportant();

    if (response.success) {
      logger.error(`PATCH /api/club/schedule/clubNum/no 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PATCH /api/club/schedule/clubNum/no 500: ${response.errMsg}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`PATCH /api/club/schedule/clubNum/no 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  deleteSchedule: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.deleteSchedule();

    if (response.success) {
      logger.error(`DELETE /api/club/schedule/clubNum/no 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `DELETE /api/club/schedule/clubNum/no 500: ${response.errMsg}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`DELETE /api/club/schedule/clubNum/no 400: ${response.msg}`);
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};
