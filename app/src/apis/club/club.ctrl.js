'use strict';

const ClubStorage = require('../../models/services/Club/ClubStorage');
const getApiInfo = require('../../models/utils/getApiInfo');
const processCtrl = require('../../models/utils/processCtrl');

const process = {
  readClubList: async (req, res) => {
    const response = await ClubStorage.readClubList();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = {
  process,
};
