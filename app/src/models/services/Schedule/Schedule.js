'use strict';

const ScheduleStorage = require('./ScheduleStorage');
const Error = require('../../utils/Error');

class Schedule {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
  }

  async findAllByClubNum() {
    const { clubNum } = this.params;

    try {
      const { success, result } = await ScheduleStorage.findAllByClubNum(
        clubNum
      );

      if (success) {
        return { success: true, result };
      }
      return { success: false, msg: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async findAllByDate() {
    const { clubNum } = this.params;
    const { date } = this.params;
    const ScheduleInfo = {
      clubNum,
      date,
    };

    try {
      const { success, result } = await ScheduleStorage.findAllByDate(
        ScheduleInfo
      );

      if (success) {
        return { success: true, result };
      }
      return { success: false, msg: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
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
        startDate: data.startDate,
        endDate: data.endDate,
        period: data.period,
      };
      const result = await ScheduleStorage.createSchedule(scheduleInfo);

      return { success: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async updateSchedule() {
    const data = this.body;
    const { clubNum } = this.params;
    const { no } = this.params;
    try {
      const scheduleInfo = {
        clubNum,
        no,
        colorCode: data.colorCode,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
        period: data.period, // 수정하는 사람 =/= 작성자 가능성O => 학생 정보는 수정시 받지 X
      };
      const result = await ScheduleStorage.updateSchedule(scheduleInfo);

      return { success: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async updateImportant() {
    const data = this.body;
    const { clubNum } = this.params;
    const { no } = this.params;

    try {
      const scheduleInfo = {
        no,
        clubNum,
        important: data.important,
      };
      const result = await ScheduleStorage.updateImportant(scheduleInfo);

      return { success: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async deleteSchedule() {
    const { clubNum } = this.params;
    const { no } = this.params;

    try {
      const scheduleInfo = {
        no,
        clubNum,
      };
      const result = await ScheduleStorage.deleteSchedule(scheduleInfo);

      return { success: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = Schedule;
