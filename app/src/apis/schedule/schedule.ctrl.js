'use strict';

const Schedule = require('../../models/services/Schedule/schedule');

const process = {
  findAllByClubNum: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.findAllByClubNum();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }

    return res.status(400).json(response);
  },

  createSchedule: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.createSchedule();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(500).json(response);
  },
};

module.exports = {
  process,
};
