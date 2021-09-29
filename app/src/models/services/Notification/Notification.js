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

  async createByIdAndTitle(notification) {
    const { body } = this;
    try {
      const notificationInfo = {
        senderId: notification.senderId,
        recipientId: notification.recipientId,
        title: notification.boardTitle,
        content: notification.content,
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

  async createByIdAndClubName(notification) {
    const { body } = this;

    try {
      const notificationInfo = {
        recipientId: notification.recipientId,
        senderId: notification.senderId,
        title: notification.clubName,
        content: notification.content,
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

  async createNotification() {
    const todaySchedule = this.body;
    const { clubNum } = this.params;
    try {
      const recipientIds = await NotificationStorage.findAllByClubNum(clubNum);

      recipientIds.forEach(async (recipientId) => {
        const clubName = await NotificationStorage.findClubNameByClubNum(
          clubNum
        );

        const notificationInfo = {
          recipientId,
          senderId: clubName,
          title: clubName,
          content: todaySchedule.title,
          url: todaySchedule.url,
          notificationCategoryNum: todaySchedule.notificationCategoryNum,
        };

        await NotificationStorage.createByIdAndClubName(notificationInfo);
      });
      return { success: true, msg: '오늘의 일정 알림이 생성되었습니다.' };
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
