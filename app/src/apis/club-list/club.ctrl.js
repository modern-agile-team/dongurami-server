'use strict';

const ClubListStorage = require('../../models/services/ClubList/ClubListStorage');
const getApiInfo = require('../../models/utils/getApiInfo');
const processCtrl = require('../../models/utils/processCtrl');

const process = {
  readClubList: async (req, res) => {
    const response = await ClubListStorage.readClubList();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = {
  process,
};
