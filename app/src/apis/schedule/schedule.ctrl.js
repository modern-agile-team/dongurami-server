'use strict';

const Schedule = require('../../models/services/Schedule/Schedule');
const logger = require('../../config/logger');

const process = {
  findAllByClubNum: async (req, res) => {
    const schedule = new Schedule(req);
    const { clubNum } = req.params;
    const response = await schedule.findAllByClubNum();

    if (response.success) {
      logger.info(`GET /api/club/schedule/${clubNum} 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `GET /api/club/schedule/${clubNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`GET /api/club/schedule/${clubNum} 404: ${response.msg}`);
    return res.status(404).json(response); // 존재하지 않는 동아리에 접근 시
  },

  findAllByDate: async (req, res) => {
    const schedule = new Schedule(req);
    const { clubNum } = req.params;
    const { date } = req.params;
    const response = await schedule.findAllByDate();

    if (response.success) {
      logger.info(
        `GET /api/club/schedule/${clubNum}/${date} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `GET /api/club/schedule/${clubNum}/${date} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(
      `GET /api/club/schedule/${clubNum}/${date} 404: ${response.msg}`
    );
    return res.status(404).json(response); // 존재하지 않는 동아리에 접근 시
  },

  createSchedule: async (req, res) => {
    const schedule = new Schedule(req);
    const { clubNum } = req.params;
    const response = await schedule.createSchedule();

    if (response.success) {
      logger.info(`POST /api/club/schedule/${clubNum} 201: ${response.msg}`);
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(
        `POST /api/club/schedule/${clubNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`POST /api/club/schedule/${clubNum} 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  updateSchedule: async (req, res) => {
    // 일정 내용과 시간과 관련하여 수정 시
    const schedule = new Schedule(req);
    const { clubNum } = req.params;
    const { no } = req.params;
    const response = await schedule.updateSchedule();

    if (response.success) {
      logger.info(
        `PUT /api/club/schedule/${clubNum}/${no} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PUT /api/club/schedule/${clubNum}/${no} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(
      `PUT /api/club/schedule/${clubNum}/${no} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  updateOnlyImportant: async (req, res) => {
    // 일정 중요도 수정
    const schedule = new Schedule(req);
    const { clubNum } = req.params;
    const { no } = req.params;
    const response = await schedule.updateOnlyImportant();

    if (response.success) {
      logger.info(
        `PATCH /api/club/schedule/${clubNum}/${no} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PATCH /api/club/schedule/${clubNum}/${no} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(
      `PATCH /api/club/schedule/${clubNum}/${no} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  deleteSchedule: async (req, res) => {
    const schedule = new Schedule(req);
    const { clubNum } = req.params;
    const { no } = req.params;
    const response = await schedule.deleteSchedule();

    if (response.success) {
      logger.info(
        `DELETE /api/club/schedule/${clubNum}/${no} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `DELETE /api/club/schedule/${clubNum}/${no} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(
      `DELETE /api/club/schedule/${clubNum}/${no} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};
