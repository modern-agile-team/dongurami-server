'use strict';

const NotificationStorage = require('./NotificationStorage');
const StudentStorage = require('../Student/StudentStorage');
const CommentStorage = require('../Board/Comment/CommentStorage');
const BoardStorage = require('../Board/BoardStorage');
const Error = require('../../utils/Error');
const WriterCheck = require('../../utils/WriterCheck');
const boardCategory = require('../Category/board');

class Notification {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async createNoticeBoardNotification() {
    try {
      const { notificationInfo, recipients } =
        await this.getBoardNotificationInfo();

      await this.sendBoardNotification(notificationInfo, recipients);

      return { success: true, msg: '전체 공지 생성 알림이 생성되었습니다.' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async createClubBoardNotification() {
    try {
      const { notificationInfo, recipients } =
        await this.getClubBoardNotificationInfo();

      await this.sendBoardNotification(notificationInfo, recipients);

      return { success: true, msg: '동아리 공지 생성 알림이 생성되었습니다.' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async getBoardNotificationInfo() {
    const board = {
      no: this.params.boardNum,
      title: this.body.boardTitle,
      notiCategoryNum: this.body.notiCategoryNum,
    };

    const notificationInfo = {
      senderName: this.auth.name,
      title: '공지 게시판',
      content: board.title,
      url: `notice/${board.no}`,
      notiCategoryNum: board.notiCategoryNum,
    };

    const recipients = await StudentStorage.findAllNameAndId();

    return { notificationInfo, recipients };
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

    const notificationInfo = {
      senderName: this.auth.name,
      title: clubName,
      content: board.title,
      url: `clubhome/${clubNum}/notice/${board.no}`,
      notiCategoryNum: board.notiCategoryNum,
    };

    const recipients = await NotificationStorage.findAllByClubNum(clubNum);

    return { notificationInfo, recipients };
  }

  async sendBoardNotification(notificationInfo, recipients) {
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
    try {
      const notificationInfo = await this.xxNewGetCmtNotificationInfo();

      const isCreate = await this.xxNewSendCmtNotification(notificationInfo);

      if (isCreate) {
        return { success: true, msg: '댓글 알림이 생성되었습니다.' };
      }
      return {
        success: false,
        msg: '작성자와 수신자가 같거나 알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async createReplyCmtNotification() {
    try {
      const recipients = await this.xxNewGetRecipientsInfoByCmtNum();

      await this.xxNewSendReplyCmtNotification(recipients);

      return { success: true, msg: '답글 알림이 생성되었습니다.' };
    } catch {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async xxNewGetRecipientsInfoByCmtNum() {
    const { params } = this;

    const recipients = await CommentStorage.findRecipientNamesByCmtAndBoardNum(
      params.cmtNum,
      params.boardNum
    );

    return recipients;
  }

  async xxNewSendReplyCmtNotification(recipients) {
    const senderId = this.auth.id;

    recipients.forEach(async (recipient) => {
      if (senderId !== recipient.id) {
        const notification = this.getReplyCmtNotificationInfo(recipient);

        await NotificationStorage.createNotification(notification);
      }
    });
  }

  getReplyCmtNotificationInfo(recipient) {
    const { params } = this;
    const category = boardCategory[params.category];
    const replyCmt = {
      description: this.body.description,
      notiCategoryNum: this.body.notiCategoryNum,
    };

    const notification = {
      senderName: this.auth.name,
      content: replyCmt.description,
      title: recipient.description,
      recipientName: recipient.name,
      recipientId: recipient.id,
      url: `${params.category}/${params.boardNum}`,
      notiCategoryNum: replyCmt.notiCategoryNum,
    };

    if (category === 4) {
      notification.url = `${params.category}?id=${params.boardNum}`;
    }

    return notification;
  }

  async xxNewGetCmtNotificationInfo() {
    const { params } = this;
    const category = boardCategory[params.category];
    const comment = {
      description: this.body.description,
      notiCategoryNum: this.body.notiCategoryNum,
    };
    const boardInfo = await BoardStorage.findBoardInfoByBoardNum(
      params.boardNum
    );

    const notificationInfo = {
      senderName: this.auth.name,
      content: this.body.description,
      title: boardInfo.title,
      recipientName: boardInfo.writerName,
      recipientId: boardInfo.writerId,
      url: `${params.category}/${params.boardNum}`,
      notiCategoryNum: comment.notiCategoryNum,
    };

    if (category === 4) {
      notificationInfo.url = `${params.category}?id=${params.boardNum}`;
    }

    return notificationInfo;
  }

  async xxNewSendCmtNotification(notificationInfo) {
    const senderId = this.auth.id;

    if (senderId !== notificationInfo.recipientId) {
      const isCreate = await NotificationStorage.createNotification(
        notificationInfo
      );
      return isCreate;
    }

    return false;
  }

  // async xxNewSendCmtAndReplyNotification() {
  //   const { params } = this;

  //   if (!params.cmtNum) {
  //     const recipient = await BoardStorage.findBoardInfoByBoardNum(
  //       params.boardNum
  //     );

  //     const notificationInfo = this.xxNewGetNotificationInfo(recipient);

  //     return this.sendCmtNotification(notificationInfo);
  //   }
  //   const recipients = await CommentStorage.findRecipientNamesByCmtAndBoardNum(
  //     params.cmtNum,
  //     params.boardNum
  //   );

  //   return this.xxNewSendReplyCmtNotification(recipients);
  // }

  // xxNewGetNotificationInfo(recipient) {
  //   return {
  //     senderName: this.auth.name,
  //     content: this.body.description,
  //     title: recipient.title || recipient.description,
  //     recipientName: recipient.name,
  //     recipientId: recipient.id,
  //   };
  // }

  // async xxNewSendReplyCmtNotification(recipients) {
  //   const senderId = this.auth.id;

  //   recipients.forEach(async (recipient) => {
  //     if (senderId !== recipient.id) {
  //       const notificationInfo = this.getNotificationInfo(recipient);

  //       await this.createNotification(notificationInfo);
  //     }
  //   });
  // }

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
