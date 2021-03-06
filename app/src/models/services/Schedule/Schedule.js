'use strict';

const ScheduleStorage = require('./ScheduleStorage');
const Error = require('../../utils/Error');

class Schedule {
  constructor(req) {
    this.req = req;
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  static makeMsg(status, msg, schedule) {
    return {
      status,
      success: status < 400,
      msg,
      schedule,
    };
  }

  async existClub() {
    const club = await ScheduleStorage.existClub(this.params.clubNum);

    return !!club;
  }

  async findAllScheduleByDate() {
    const scheduleInfo = {
      clubNum: this.params.clubNum,
      date: this.params.date,
    };

    try {
      const club = await this.existClub();

      if (club) {
        const schedule = await ScheduleStorage.findAllScheduleByDate(
          scheduleInfo
        );

        return Schedule.makeMsg(200, '일정 조회 성공', schedule);
      }
      return Schedule.makeMsg(404, '존재하지 않는 동아리입니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async createSchedule() {
    const data = this.body;

    try {
      const scheduleInfo = {
        clubNum: this.params.clubNum,
        studentId: this.auth.id,
        colorCode: data.colorCode,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
      };

      const success = await ScheduleStorage.createSchedule(scheduleInfo);

      if (success) return Schedule.makeMsg(201, '일정이 등록되었습니다.');
      return Schedule.makeMsg(400, '일정 등록에 실패하였습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateSchedule() {
    const data = this.body;

    try {
      const scheduleInfo = {
        no: this.params.no,
        colorCode: data.colorCode,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
      };
      const success = await ScheduleStorage.updateSchedule(scheduleInfo);

      if (success) return Schedule.makeMsg(200, '일정이 수정되었습니다.');
      return Schedule.makeMsg(400, '일정이 수정되지 않았습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateOnlyImportant() {
    try {
      const scheduleInfo = {
        no: this.params.no,
        important: this.body.important,
      };

      const success = await ScheduleStorage.updateOnlyImportant(scheduleInfo);

      if (success) {
        return Schedule.makeMsg(200, '주요 일정으로 등록되었습니다.');
      }
      return Schedule.makeMsg(400, '주요 일정으로 등록되지 않았습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async deleteSchedule() {
    try {
      const success = await ScheduleStorage.deleteSchedule(this.params.no);

      if (success) {
        return Schedule.makeMsg(200, '일정이 삭제되었습니다.');
      }
      return Schedule.makeMsg(400, '일정이 삭제되지 않았습니다.');
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = Schedule;
