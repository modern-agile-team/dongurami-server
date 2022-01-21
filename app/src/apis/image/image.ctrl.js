'use strict';

const Image = require('../../models/services/Image/Image');
const getApiInfo = require('../../models/utils/getApiInfo');
const processCtrl = require('../../models/utils/processCtrl');

const process = {
  saveBoardImg: async (req, res) => {
    const image = new Image(req);
    const response = await image.saveBoardImg();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  updateBoardImg: async (req, res) => {
    const image = new Image(req);
    const response = await image.updateBoardImg();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  deleteBoardImg: async (req, res) => {
    const image = new Image(req);
    const response = await image.deleteBoardImg();
    const apiInfo = getApiInfo('DELETE', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = { process };
