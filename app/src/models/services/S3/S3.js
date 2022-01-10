'use strict';

const AWS = require('aws-sdk');
const crypto = require('crypto');
const Error = require('../../utils/Error');
const resourceNullCheck = require('../../utils/resourceNullCheck');
const makeResponse = require('../../utils/makeResponse');

class S3 {
  constructor(req) {
    this.body = req.body;
  }

  async createPutUrl() {
    const isEmpty = resourceNullCheck(this.body);
    let { img } = this.body;

    if (isEmpty.success) {
      return makeResponse(isEmpty.status, isEmpty.msg);
    }

    try {
      const randomString = crypto.randomBytes(5).toString('hex');

      img = `${randomString}_${img}`;
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

      return {
        success: true,
        msg: 'url 생성 성공',
        preSignedPutUrl,
        readObjectUrl,
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요', err);
    }
  }
}

module.exports = S3;
