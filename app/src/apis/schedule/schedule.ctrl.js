'use strict';

const Schedule = require('../../models/services/Schedule/Schedule');

const process = {
  findAllByClubNum: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.findAllByClubNum();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clinetMsg });
    }
    return res.status(404).json(response); // 존재하지 않는 동아리에 접근 시
  },

  findAllByDate: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.findAllByDate();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res.status(404).json(response); // 존재하지 않는 동아리에 접근 시
  },

  createSchedule: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.createSchedule();

    if (response.success) {
      return res.status(201).json(response);
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res
      .status(400)
      .json({ success: false, msg: '서버 개발자에게 문의해주세요.' });
  },

  updateSchedule: async (req, res) => {
    // 일정 내용과 시간과 관련하여 수정 시
    const schedule = new Schedule(req);
    const response = await schedule.updateSchedule();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res
      .status(400)
      .json({ success: false, msg: '서버 개발자에게 문의해주세요.' });
  },

  updateOnlyImportant: async (req, res) => {
    // 일정 중요도 수정
    const schedule = new Schedule(req);
    const response = await schedule.updateOnlyImportant();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res
      .status(400)
      .json({ success: false, msg: '서버 개발자에게 문의해주세요.' });
  },

  deleteSchedule: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.deleteSchedule();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res
      .status(400)
      .json({ success: false, msg: '서버 개발자에게 문의해주세요.' });
  },
};

module.exports = {
  process,
};
