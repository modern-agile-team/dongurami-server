'use strict';

const request = require('request');
const Error = require('../../utils/Error');
const Student = require('../Student/Student');
const StudentStorage = require('../Student/StudentStorage');

class OAuth {
  constructor(req) {
    this.query = req.query;
    this.body = req.body;
    this.req = req;
  }

  findOneByInformation() {
    return new Promise((resolve, reject) => {
      // const token = this.query;
      const token = Object.keys(this.query)[0];
      // const header = `Bearer ${token.token}`;
      const header = `Bearer ${token}`;
      const options = {
        uri: 'https://openapi.naver.com/v1/nid/me',
        headers: { Authorization: `${header}` },
        method: 'GET',
      };

      request.get(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const result = JSON.parse(body);
          resolve(result.response);
        } else {
          reject(JSON.parse(body));
        }
      });
    });
  }

  async signUpCheck() {
    const student = new Student(this.req);
    const saveInfo = this.body;

    try {
      const snsJoinedUser = await StudentStorage.findOneBySnsId(saveInfo.snsId);

      if (snsJoinedUser.success) {
        const loginResult = await student.naverLogin(student);

        return loginResult;
      }
      const generalJoinedUser = await StudentStorage.findOneById(saveInfo.id);

      if (generalJoinedUser) {
        return { success: false, msg: '일반회원으로 가입된 회원입니다.' };
      }
      return { success: false };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }
}
module.exports = OAuth;
