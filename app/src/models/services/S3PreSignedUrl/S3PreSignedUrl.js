'use strict';

const AWS = require('aws-sdk');
const Error = require('../../utils/Error');

class S3 {
  constructor(req) {
    this.body = req.body;
  }

  async createPutUrl() {
    const { img } = this.body;

    if (img === undefined) {
      return { success: false, msg: '객체 이름을 적어주세요' };
    }

    try {
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

      return { success: true, msg: 'url 생성 성공', preSignedPutUrl };
    } catch (err) {
      console.log(err);
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요', err);
    }
  }
}

module.exports = S3;
