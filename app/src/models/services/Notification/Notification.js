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

  async createByIdAndTitle(recipientId, content) {
    const { body } = this;
    try {
      const notificationInfo = {
        senderId,
        recipientId,
        content,
        url: body.url,
        notificationCategoryNum: body.notificationCategoryNum,
      };

      const success = await NotificationStorage.createByIdAndTitle(
        notificationInfo
      );

      if (success) {
        return success;
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async createByIdAndClubName(recipientId, senderId, clubName) {
    const { body } = this;

    try {
      const notificationInfo = {
        recipientId,
        senderId,
        clubName,
        url: body.url,
        notificationCategoryNum: body.notificationCategoryNum,
      };

      const success = await NotificationStorage.createByIdAndClubName(
        notificationInfo
      );

      if (success) {
        return success;
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async deleteByNotificationNum() {
    const { notificationNum } = this.body;

    try {
      const isDelete = await NotificationStorage.deleteByNotificationNum(
        notificationNum
      );

      if (isDelete) {
        return { success: true, msg: '읽은 알림이 삭제되었습니다.' };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async deleteAllById() {
    const studentId = this.body.id;

    try {
      const isDelete = await NotificationStorage.deleteAllById(studentId);

      if (isDelete) {
        return { success: true, msg: '전체 알림이 삭제되었습니다.' };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요', err);
    }
  }
}
module.exports = Notification;
