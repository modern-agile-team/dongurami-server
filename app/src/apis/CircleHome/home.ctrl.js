'use strict';

// const mariadb = require('../../config/mariadb');
const Home = require('../../models/services/CircleHome/home');

const process = {
  findOneByClubNum: async (req, res) => {
    const home = new Home(req);
    const response = await home.findOneByClubNum();
    if (response.success) {
      return res.status(201).json(response);
    }
    return res.json({ success: `${false}in ctrl.js` });
  },
  enroll: async (req, res) => {
    const home = new Home(req);
    const response = await home.Club();
    if (response.result) {
      return res.json({
        success,
      });
    }
    return res.json({ success: false });
  },
};

module.exports = {
  process,
};
