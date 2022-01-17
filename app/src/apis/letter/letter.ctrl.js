'use strict';

const Letter = require('../../models/services/Letter/Letter');
const getApiInfo = require('../../models/utils/getApiInfo');
const processCtrl = require('../../models/utils/processCtrl');

const process = {
  findLetterNotifications: async (req, res) => {
    const letter = new Letter(req);
    const response = await letter.findLetterNotifications();
    const apiInfo = getApiInfo('GET', response, req);
    return processCtrl(res, apiInfo);
  },

  findAllLetterList: async (req, res) => {
    const letter = new Letter(req);
    const response = await letter.findAllLetterList();
    const apiInfo = getApiInfo('GET', response, req);
    return processCtrl(res, apiInfo);
  },

  findLettersByGroup: async (req, res) => {
    const letter = new Letter(req);
    const response = await letter.findLettersByGroup();
    const apiInfo = getApiInfo('GET', response, req);
    return processCtrl(res, apiInfo);
  },

  createLetter: async (req, res) => {
    const letter = new Letter(req);
    const response = await letter.createLetter();
    const apiInfo = getApiInfo('POST', response, req);
    return processCtrl(res, apiInfo);
  },

  createReplyLetter: async (req, res) => {
    const letter = new Letter(req);
    const response = await letter.createReplyLetter();
    const apiInfo = getApiInfo('POST', response, req);
    return processCtrl(res, apiInfo);
  },

  deleteLetterNotifications: async (req, res) => {
    const letter = new Letter(req);
    const response = await letter.deleteLetterNotifications();
    const apiInfo = getApiInfo('PUT', response, req);
    return processCtrl(res, apiInfo);
  },

  deleteLettersByGroupNo: async (req, res) => {
    const letter = new Letter(req);
    const response = await letter.deleteLettersByGroupNo();
    const apiInfo = getApiInfo('DELETE', response, req);
    return processCtrl(res, apiInfo);
  },
};

module.exports = {
  process,
};
