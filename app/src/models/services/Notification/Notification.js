'use strict';

const NotificationStorage = require('./NotificationStorage');
const StudentStorage = require('../Student/StudentStorage');
const Error = require('../../utils/Error');
const WriterCheck = require('../../utils/WriterCheck');
const boardCategory = require('../Category/board');

class Notification {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async createBoardNotification() {
    try {
      const { notificationInfo, recipients } =
        await this.getNotificationInfoByBoardCategoryNum();

      await this.sendNotification(notificationInfo, recipients);

      return { success: true, msg: '알림이 생성되었습니다.' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async getNotificationInfoByBoardCategoryNum() {
    const { clubNum } = this.params;
    const category = boardCategory[this.params.category];

    let notificationInfo;
    let recipients;

    if (category === 1) {
      notificationInfo = await this.getBoardNotificationInfo();

      recipients = await StudentStorage.findAllNameAndId();
    }
    if (category === 5) {
      notificationInfo = await this.getClubBoardNotificationInfo();

      recipients = await NotificationStorage.findAllByClubNum(clubNum);
    }

    return { notificationInfo, recipients };
  }

  async getBoardNotificationInfo() {
    const board = {
      no: this.params.boardNum,
      title: this.body.boardTitle,
      notiCategoryNum: this.body.notiCategoryNum,
    };

    return {
      senderName: this.auth.name,
      title: '공지 게시판',
      content: board.title,
      url: `notice/${board.no}`,
      notiCategoryNum: board.notiCategoryNum,
    };
  }

  async getClubBoardNotificationInfo() {
    const { clubNum } = this.params;
    const board = {
      no: this.params.boardNum,
      title: this.body.boardTitle,
      notiCategoryNum: this.body.notiCategoryNum,
    };

    const { clubName } = await NotificationStorage.findClubInfoByClubNum(
      clubNum
    );

    return {
      senderName: this.auth.name,
      title: clubName,
      content: board.title,
      url: `clubhome/${clubNum}/notice/${board.no}`,
      notiCategoryNum: board.notiCategoryNum,
    };
  }

  async sendNotification(notificationInfo, recipients) {
    const senderId = this.auth.id;

    recipients.forEach(async (recipient) => {
      if (senderId !== recipient.id) {
        const notification = {
          senderName: notificationInfo.senderName,
          recipientName: recipient.name,
          recipientId: recipient.id,
          title: notificationInfo.title,
          content: notificationInfo.content,
          url: notificationInfo.url,
          notiCategoryNum: notificationInfo.notiCategoryNum,
        };

        await NotificationStorage.createNotification(notification);
      }
    });
  }

  async createCmtNotification() {
    const cmt = this.body;
    console.log(cmt);
  }

  async createReplyCmtNotification() {
    const replyCmt = this.body;
    console.log(replyCmt);
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

  // 없어질 함수.
  async createNotification(notification) {
    const { body } = this;

    try {
      const notificationInfo = {
        title: notification.title || notification.clubName,
        senderName: notification.senderName,
        recipientName: notification.recipientName,
        recipientId: notification.recipientId,
        content: notification.content,
        url: body.url || notification.url,
        notiCategoryNum: body.notiCategoryNum,
      };

      const success = await NotificationStorage.createNotification(
        notificationInfo
      );

      if (success) {
        return { success: true };
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
    const user = this.auth;

    try {
      const isWriterCheck = await WriterCheck.ctrl(
        user.id,
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
    const studentName = this.auth.name;

    try {
      const isUpdate = await NotificationStorage.updateAllById(studentName);

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
