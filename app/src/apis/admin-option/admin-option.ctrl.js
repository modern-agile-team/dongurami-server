'use strict';

const AdminOption = require('../../models/services/AdminOption/AdminOption');
const Application2 = require('../../models/services/Application2/Application2');

const process = {
  checkClubAdmin: async (req, res, next) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.checkClubAdmin();

    if (!response.success) {
      return res.status(401).json(response);
    }
    return next();
  },

  findOneByClubNum: async (req, res) => {
    const adminOption = new AdminOption(req);
    const application2 = new Application2(req);

    const response = {};
    response.clubAdminOption = await adminOption.findOneByClubNum();

    if (response.clubAdminOption.success) {
      response.applicant = await application2.findOneByClubNum();
      if (response.applicant.isError) {
        return res.status(500).json(response.applicant.clientMsg);
      }
      if (!response.applicant) {
        return res.status(400).json(response);
      }
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(400).json(response.clientMsg);
    }
    return res.status(500).json(response);
  },

  updateAdminOptionById: async (req, res) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.updateAdminOptionById();

    return res.status(201).json(response);
  },
};

module.exports = {
  process,
};
