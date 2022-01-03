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
    const { studentId } = req.params;

    if (response.success) {
      logger.info(`PUT /api/profile/${studentId} 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PUT /api/profile/${studentId} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`PUT /api/profile/${studentId} 400: ${response.msg}`);
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};
