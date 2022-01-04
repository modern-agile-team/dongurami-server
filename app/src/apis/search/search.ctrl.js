'use strict';

const Search = require('../../models/services/Search/Search');
const processCtrl = require('../../models/utils/processCtrl');
const getApiInfo = require('../../models/utils/getApiInfo');

const process = {
  findAllSearch: async (req, res) => {
    const search = new Search(req);
    const response = await search.findAllSearch();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  findAllPromotionSearch: async (req, res) => {
    const search = new Search(req);
    const response = await search.findAllPromotionSearch();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  findAllClubList: async (req, res) => {
    const search = new Search(req);
    const response = await search.findAllClubList();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = {
  process,
};
