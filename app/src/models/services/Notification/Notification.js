'use strict';

const NotificationStorage = require('./NotificationStorage');
const Error = require('../../utils/Error');

class Notification {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
  }

  async findAllById() {
    const { studentId } = this.params;

    try {
      const { success, notifications } = await NotificationStorage.findAllById(
        studentId
      );

      if (success) {
        return {
          success: true,
          msg: '알림이 성공적으로 조회되었습니다.',
          notifications,
        };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async updateByNotificationNum() {
    const { notificationNum } = this.body;

    try {
      const isUpdate =
        await NotificationStorage.updateReadFlagByNotificationNum(
          notificationNum
        );

      if (isUpdate) {
        return { success: true, msg: '알림 읽음 여부가 수정되었습니다.' };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }
}
module.exports = Notification;
