'use strict';

const scheduleStorage = require('./scheduleStorage');
const Error = require('../../utils/Error');

class Schedule {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
  }

  async findAllByClubNum() {
    const { clubNum } = this.params;

    try {
      const { success, result } = await scheduleStorage.findAllByClubNum(
        clubNum
      );

      if (success) {
        return { success: true, result };
      }
      return { success: false, msg: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요', err);
    }
  }

  async createSchedule() {
    const data = this.body;
    const { params } = this;

    try {
      const scheduleInfo = {
        clubNum: params.clubNum,
        studentId: data.studentId,
        colorCode: data.colorCode,
        title: data.title,
        description: data.description,
        important: data.important,
      };
      const result = await scheduleStorage.createSchedule(scheduleInfo);

      return { success: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요', err);
    }
  }
}

module.exports = Schedule;
