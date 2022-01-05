'use strict';

const Schedule = require('../../models/services/Schedule/Schedule');
const getApiInfo = require('../../models/utils/getApiInfo');
const processCtrl = require('../../models/utils/processCtrl');

const process = {
  findAllScheduleByDate: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.findAllScheduleByDate();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  createSchedule: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.createSchedule();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  updateSchedule: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.updateSchedule();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  updateOnlyImportant: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.updateOnlyImportant();
    const apiInfo = getApiInfo('PATCH', response, req);

    return processCtrl(res, apiInfo);
  },

  deleteSchedule: async (req, res) => {
    const schedule = new Schedule(req);
    const response = await schedule.deleteSchedule();
    const apiInfo = getApiInfo('DELETE', response, req);

    return processCtrl(res, apiInfo);
  },
};
module.exports = {
  process,
};
