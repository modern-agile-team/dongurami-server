'use strict';

const NotificationStorage = require('./NotificationStorage');
const Error = require('../../utils/Error');
const WriterCheck = require('../../utils/WriterCheck');

class Notification {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findAllById() {
    const studentId = this.auth.id;

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

  async createCmtNotification(notification) {
    const { body } = this;

    try {
      const notificationInfo = {
        senderName: notification.senderName,
        recipientName: notification.recipientName,
        title: notification.title,
        content: notification.content,
        url: body.url,
        notiCategoryNum: body.notiCategoryNum,
      };

      const success = await NotificationStorage.createCmtNotification(
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

  async createNotification(notification) {
    const { body } = this;

    try {
      const notificationInfo = {
        recipientName: notification.recipientName,
        senderName: notification.senderName,
        title: notification.clubName,
        content: notification.content,
        url: body.url,
        notiCategoryNum: body.notiCategoryNum,
      };

      const success = await NotificationStorage.createNotification(
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

  async updateOneByNotificationNum() {
    const notificationNum = Number(this.params.notificationNum);
    const userId = this.auth.id;

    try {
      const isWriterCheck = await WriterCheck.ctrl(
        userId,
        notificationNum,
        'notifications',
        'no',
        'recipient_id'
      );

      if (!isWriterCheck.success) return isWriterCheck;

      const isUpdate = await NotificationStorage.updateOneByNotificationNum(
        notificationNum
      );

      if (isUpdate) {
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

  async updateAllById() {
    const studentId = this.auth.id;

    try {
      const isUpdate = await NotificationStorage.updateAllById(studentId);

      if (isUpdate) {
        return { success: true, msg: '전체 알림이 삭제되었습니다.' };
      }
      return {
        success: false,
        msg: '삭제 할 알림이 없거나 알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요', err);
    }
  }
}

module.exports = Notification;
