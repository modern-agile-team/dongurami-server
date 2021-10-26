'use strict';

const Profile = require('../../models/services/Profile/Profile');
const logger = require('../../config/logger');

const process = {
  findOneByStudentId: async (req, res) => {
    const profile = new Profile(req);
    const response = await profile.findOneByStudentId();
    const { studentId } = req.params;

    if (response.success) {
      logger.info(`GET /api/profile/${studentId} 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`GET /api/profile/${studentId} 500: ${response.errMsg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`GET /api/profile/${studentId} 400: ${response.msg}`);
    return res.status(400).json(response);
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
      logger.error(`PUT /api/profile/${studentId} 500: ${response.errMsg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`PUT /api/profile/${studentId} 400: ${response.msg}`);
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};
