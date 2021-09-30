'use strict';

const Profile = require('../../models/services/Profile/Profile');

const process = {
  findOneByStudentId: async (req, res) => {
    const profile = new Profile(req);
    const response = await profile.findOneByStudentId();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(400).json(response);
  },

  updateStudentInfo: async (req, res) => {
    const profile = new Profile(req);
    const response = await profile.updateStudentInfo();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};
