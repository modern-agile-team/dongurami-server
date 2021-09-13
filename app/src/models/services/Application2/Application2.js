'use strict';

const ApplicationStorage2 = require('./ApplicationStorage2');
// const Error = require('../../utils/Error');

class Application {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findOneApplicationByClubNum() {
    const clubNum = Number(this.params.clubNum);
    const { applicationInfo } =
      await ApplicationStorage2.findOneApplicationByClubNum(clubNum);

    return { success: true, applicationInfo };
  }
}

module.exports = Application;
