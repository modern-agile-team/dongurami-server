'use strict';

const AWS = require('aws-sdk');
const crypto = require('crypto');
const Error = require('../../utils/Error');
const getNullResource = require('../../utils/getNullResource');
const makeResponse = require('../../utils/makeResponse');

class S3 {
  constructor(req) {
    this.body = req.body;
  }

  async createPutUrl() {
    const nullValue = getNullResource(this.body);

    if (nullValue) {
      return makeResponse(400, `${key}이(가) 빈값입니다.`);
    }

    try {
      const randomString = crypto.randomBytes(5).toString('hex');

      const img = `${randomString}_${this.body.img}`;
      const readObjectUrl = process.env.CLOUDFRONT_URL + img;

      const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
        region: process.env.S3_REGION,
      });

      const preSignedPutUrl = await s3.getSignedUrl('putObject', {
        Bucket: process.env.S3_BUCKET_NAME,
        Expires: Number(process.env.S3_EXPIRES),
        Key: img,
      });

      return makeResponse(200, 'url 생성 성공', preSignedPutUrl, readObjectUrl);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = S3;
