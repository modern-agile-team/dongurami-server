'use strict';

const Profile = require('../../models/services/Profile/Profile');
const getApiInfo = require('../../models/utils/getApiInfo');
const processCtrl = require('../../models/utils/processCtrl');

const process = {
  findOneByStudentId: async (req, res) => {
    const profile = new Profile(req);
    const response = await profile.findOneByStudentId();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  updateStudentInfo: async (req, res) => {
    const profile = new Profile(req);
    const response = await profile.updateStudentInfo();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = {
  process,
};
