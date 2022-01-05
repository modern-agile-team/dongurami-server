'use strict';

const ScheduleStorage = require('./ScheduleStorage');
// const Notification = require('../Notification/Notification');
// const NotificationStorage = require('../Notification/NotificationStorage');
const Error = require('../../utils/Error');

class Schedule {
  constructor(req) {
    this.req = req;
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  static makeMsg(status, msg, result) {
    return {
      status,
      success: status < 400,
      msg,
      result,
    };
  }

  async existClub() {
    const club = await ScheduleStorage.existClub(this.params.clubNum);

    return club;
  }

  async findAllScheduleByDate() {
    const scheduleInfo = {
      clubNum: this.params.clubNum,
      date: this.params.date,
    };

    try {
      const club = await this.existClub();

      if (club) {
        const result = await ScheduleStorage.findAllScheduleByDate(
          scheduleInfo
        );

        return Schedule.makeMsg(200, '일정 조회 성공', result);
      }
      return Schedule.makeMsg(404, '존재하지 않는 동아리입니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async createSchedule() {
    const data = this.body;
    const user = this.auth;
    // const notification = new Notification(this.req);

    try {
      const scheduleInfo = {
        clubNum: this.params.clubNum,
        studentId: user.id,
        colorCode: data.colorCode,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
      };

      const success = await ScheduleStorage.createSchedule(scheduleInfo);

      if (success) {
        // const recipients = await NotificationStorage.findAllByClubNum(clubNum);

        // const { clubName } = await NotificationStorage.findClubInfoByClubNum(
        //   clubNum
        // );

        // const senderId = scheduleInfo.studentId;

        // recipients.forEach(async (recipient) => {
        //   if (senderId !== recipient.id) {
        //     const notificationInfo = {
        //       clubName,
        //       senderName: user.name,
        //       recipientName: recipient.name,
        //       recipientId: recipient.id,
        //       content: scheduleInfo.title,
        //     };

        //     await notification.createNotification(notificationInfo);
        //   }
        // });
        return Schedule.makeMsg(201, '일정이 등록되었습니다.');
      }
      return Schedule.makeMsg(400, '일정 등록에 실패하였습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateSchedule() {
    const data = this.body;
    // const { clubNum } = this.params;
    // const userInfo = this.auth;
    // const notification = new Notification(this.req);

    try {
      const scheduleInfo = {
        no: this.params.no,
        colorCode: data.colorCode,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
      };
      const success = await ScheduleStorage.updateSchedule(scheduleInfo);

      if (success) {
        // const recipients = await NotificationStorage.findAllByClubNum(clubNum);
        // const { clubName } = await NotificationStorage.findClubInfoByClubNum(
        //   clubNum
        // );
        // const senderId = userInfo.id;
        // recipients.forEach(async (recipient) => {
        //   if (senderId !== recipient.id) {
        //     const notificationInfo = {
        //       clubName,
        //       senderName: userInfo.name,
        //       recipientName: recipient.name,
        //       recipientId: recipient.id,
        //       content: scheduleInfo.title,
        //     };
        //     await notification.createNotification(notificationInfo);
        //   }
        // });
        return Schedule.makeMsg(200, '일정이 수정되었습니다.');
      }
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
    const { no } = this.params;

    try {
      const success = await ScheduleStorage.deleteSchedule(no);

      if (success) {
        return { success: true, msg: '일정이 삭제되었습니다.' };
      }
      return { success: false, msg: '일정이 삭제되지 않았습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = Schedule;
