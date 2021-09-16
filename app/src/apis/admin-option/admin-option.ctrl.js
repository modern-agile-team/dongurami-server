'use strict';

const AdminOption = require('../../models/services/AdminOption/AdminOption');
const Application = require('../../models/services/Application/Application');

const process = {
  checkClubAdmin: async (req, res, next) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.checkClubAdmin();

    if (!response.success) {
      return res.status(400).json(response);
    }
    return next();
  },

  findOneByClubNum: async (req, res) => {
    const adminOption = new AdminOption(req);
    const application = new Application(req);

    const response = {};
    response.clubAdminOption = await adminOption.findOneByClubNum();

    if (response.clubAdminOption.success) {
      response.applicant = await application.findOneByClubNum();

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

  updateLeaderById: async (req, res) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.updateLeaderById();

    return res.status(200).json(response);
  },

  updateAdminOptionById: async (req, res) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.updateAdminOptionById();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(400).json(response);
  },

  createMemberById: async (req, res) => {
    const application = new Application(req);
    const response = await application.createMemberById();

    if (response.success) {
      return res.status(201).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(400).json(response);
  },

  updateApplicantById: async (req, res) => {
    const application = new Application(req);
    const response = await application.updateApplicantById();

    return res.status(200).json(response);
  },
};

module.exports = {
  process,
};
