'use strict';

const S3 = require('../../models/services/S3/S3');
const getApiInfo = require('../../models/utils/getApiInfo');
const processCtrl = require('../../models/utils/processCtrl');

const process = {
  createPutUrl: async (req, res) => {
    const s3 = new S3(req);
    const response = await s3.createPutUrl();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = { process };
