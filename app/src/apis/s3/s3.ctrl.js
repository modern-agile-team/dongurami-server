'use strict';

const S3 = require('../../models/services/S3PreSignedUrl/S3PreSignedUrl');

const process = {
  createPutUrl: async (req, res) => {
    const s3 = new S3(req);
    const response = await s3.createPutUrl();

    if (response.success) return res.status(201).json(response);
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res.status(400).json(response);
  },
};

module.exports = { process };
