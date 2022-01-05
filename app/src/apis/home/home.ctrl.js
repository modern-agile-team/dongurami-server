'use strict';

const Home = require('../../models/services/Home/Home');
const getApiInfo = require('../../models/utils/getApiInfo');
const processCtrl = require('../../models/utils/processCtrl');

const process = {
  findOneByClubNum: async (req, res) => {
    const home = new Home(req);
    const response = await home.findOneByClubNum();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  updateClubIntroduce: async (req, res) => {
    const home = new Home(req);
    const response = await home.updateClubIntroduce();
    const apiInfo = getApiInfo('PATCH', response, req);

    return processCtrl(res, apiInfo);
  },

  updateClubLogo: async (req, res) => {
    const home = new Home(req);
    const response = await home.updateClubLogo();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = {
  process,
};
