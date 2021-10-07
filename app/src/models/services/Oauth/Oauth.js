'use strict';

const request = require('request');

class Oauth {
  constructor(req) {
    this.query = req.query;
  }

  naverLogin() {
    return new Promise((resolve, reject) => {
      const token = this.query;
      const header = `Bearer ${token.token}`;
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
}
module.exports = Oauth;
