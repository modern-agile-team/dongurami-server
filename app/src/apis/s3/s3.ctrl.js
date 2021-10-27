'use strict';

const S3 = require('../../models/services/S3PreSignedUrl/S3PreSignedUrl');

const process = {
  createPutUrl: async (req, res) => {
    const s3 = new S3(req);
    const response = await s3.createPutUrl();

    if (response.success) {
      logger.info(`POST /api/s3/pre-signed-url 201: ${response.msg}`);
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(
        `POST /api/s3/pre-signed-url 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`POST /api/s3/pre-signed-url 400: ${response.msg}`);
    return res.status(400).json(response);
  },
};

module.exports = { process };
