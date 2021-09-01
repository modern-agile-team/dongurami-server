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
  updateClubInfo: async (req, res) => {
    const home = new Home(req);
    const response = await home.saveClub();
    if (response) {
      return res.json({ success: true });
    }
    return res.json({ success: false, 여기: 'ctrl.js' });
  },
};

module.exports = {
  process,
};
