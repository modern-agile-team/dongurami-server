'use strict';

const AdminOption = require('../../models/services/AdminOption/AdminOption');
// const Application = require('../../mdoels/services/Application/Application');

const process = {
  findOneByClubNum: async (req, res) => {
    const adminOption = new AdminOption(req);
    // const application = new Application(req);
    const response = await adminOption.findOneByClubNum();
    return res.status(200).json(response);
  },
};

module.exports = {
  process,
};
