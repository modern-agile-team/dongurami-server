'use strict';

const AdminOption = require('../../models/services/AdminOption/AdminOption');
const Application2 = require('../../models/services/Application2/Application2');

const process = {
  findOneAdminByClubNum: async (req, res) => {
    const adminOption = new AdminOption(req);
    const application2 = new Application2(req);

    const adminOptionRes = await adminOption.findOneByClubNum();
    const applicationRes = await application2.findOneApplicationByClubNum();

    const response = { adminOptionRes, applicationRes };

    return res.status(200).json(response);
  },

  checkClubAdmin: async (req, res) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.checkClubAdmin();

    return res.status(200).json(response);
  },
};

module.exports = {
  process,
};
