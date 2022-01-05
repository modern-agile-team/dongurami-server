'use strict';

const NotificationStorage = require('./NotificationStorage');
const Error = require('../../utils/Error');
const WriterCheck = require('../../utils/WriterCheck');
const boardCategory = require('../Category/board');

class Notification {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  // async createNoticeBoardNotification() {
  //   try {
  //     const { notificationInfo, recipients } =
  //       await this.getBoardNotificationInfo();

  //     await this.sendBoardNotification(notificationInfo, recipients);

  //     return { success: true, msg: '전체공지 알림이 생성되었습니다.' };
  //   } catch (err) {
  //     return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
  //   }
  // }

  async createNoticeBoardNotification() {
    try {
      const recipients = await NotificationStorage.findAllStudentNameAndId();

      await this.sendBoardNotification(recipients);

      return { success: true, msg: '전체공지 알림이 생성되었습니다.' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async createClubNoticeBoardNotification() {
    const { clubNum } = this.params;

    try {
      const recipients = await NotificationStorage.findAllMemberInfoByClubNum(
        clubNum
      );

      await this.sendBoardNotification(recipients);

      return { success: true, msg: '동아리공지 알림이 생성되었습니다.' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async sendBoardNotification(recipients) {
    const senderId = this.auth.id;

    recipients.forEach(async (recipient) => {
      if (senderId !== recipient.id) {
        const notification = await this.xgetBoardNotificationInfo(recipient);

        await NotificationStorage.createNotification(notification);
      }
    });
  }

  async xgetBoardNotificationInfo(recipient) {
    const { clubNum } = this.params;
    const board = {
      no: this.params.boardNum,
      title: this.body.boardTitle,
      notiCategoryNum: this.body.notiCategoryNum,
    };

    const notification = {
      senderName: this.auth.name,
      recipientName: recipient.name,
      recipientId: recipient.id,
      title: '공지 게시판',
      content: board.title,
      url: `notice/${board.no}`,
      notiCategoryNum: board.notiCategoryNum,
    };

    if (clubNum) {
      const { clubName } = await NotificationStorage.findClubInfoByClubNum(
        clubNum
      );

      notification.title = clubName;
      notification.ulr = `clubhome/${clubNum}/notice/${board.no}`;
    }
    return notification;
  }

  // async createClubBoardNotification() {
  //   try {
  //     const { notificationInfo, recipients } =
  //       await this.getClubBoardNotificationInfo();

  //     await this.sendBoardNotification(notificationInfo, recipients);

  //     return { success: true, msg: '동아리공지 알림이 생성되었습니다.' };
  //   } catch (err) {
  //     return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
  //   }
  // }

  // async getBoardNotificationInfo() {
  //   const board = {
  //     no: this.params.boardNum,
  //     title: this.body.boardTitle,
  //     notiCategoryNum: this.body.notiCategoryNum,
  //   };

  //   const recipients = await NotificationStorage.findAllStudentNameAndId();

  //   const notificationInfo = {
  //     senderName: this.auth.name,
  //     title: '공지 게시판',
  //     content: board.title,
  //     url: `notice/${board.no}`,
  //     notiCategoryNum: board.notiCategoryNum,
  //   };

  //   return { recipients, notificationInfo };
  // }

  // async getClubBoardNotificationInfo() {
  //   const { clubNum } = this.params;
  //   const board = {
  //     no: this.params.boardNum,
  //     title: this.body.boardTitle,
  //     notiCategoryNum: this.body.notiCategoryNum,
  //   };

  //   const { clubName } = await NotificationStorage.findClubInfoByClubNum(
  //     clubNum
  //   );

  //   const recipients = await NotificationStorage.findAllMemberInfoByClubNum(
  //     clubNum
  //   );
  //   const notificationInfo = {
  //     senderName: this.auth.name,
  //     title: clubName,
  //     content: board.title,
  //     url: `clubhome/${clubNum}/notice/${board.no}`,
  //     notiCategoryNum: board.notiCategoryNum,
  //   };

  //   return { recipients, notificationInfo };
  // }

  // async sendBoardNotification(notificationInfo, recipients) {
  //   const senderId = this.auth.id;

  //   recipients.forEach(async (recipient) => {
  //     if (senderId !== recipient.id) {
  //       const notification = {
  //         senderName: notificationInfo.senderName,
  //         recipientName: recipient.name,
  //         recipientId: recipient.id,
  //         title: notificationInfo.title,
  //         content: notificationInfo.content,
  //         url: notificationInfo.url,
  //         notiCategoryNum: notificationInfo.notiCategoryNum,
  //       };

  //       await NotificationStorage.createNotification(notification);
  //     }
  //   });
  // }

  async createCmtNotification() {
    try {
      const notification = await this.getCmtNotificationInfo();

      const isCreate = await this.sendLikeAndCmtNotification(notification);

      if (isCreate) {
        return { success: true, msg: '댓글 알림이 생성되었습니다.' };
      }
      return {
        success: false,
        msg: '작성자와 수신자가 같거나 알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async getCmtNotificationInfo() {
    const { params } = this;
    const category = boardCategory[params.category];
    const comment = {
      description: this.body.description,
      notiCategoryNum: this.body.notiCategoryNum,
    };
    const recipient = await NotificationStorage.findBoardInfoByBoardNum(
      params.boardNum
    );

    const notification = {
      senderName: this.auth.name,
      recipientName: recipient.name,
      recipientId: recipient.id,
      title: recipientInfo.title,
      content: comment.description,
      url: `${params.category}/${params.boardNum}`,
      notiCategoryNum: comment.notiCategoryNum,
    };

    if (category === 4) {
      notification.url = `${params.category}?id=${params.boardNum}`;
    }

    return notification;
  }

  async sendLikeAndCmtNotification(notification) {
    const senderId = this.auth.id;

    if (senderId !== notification.recipientId) {
      const isCreate = await NotificationStorage.createNotification(
        notification
      );
      return isCreate;
    }

    return false;
  }

  async createReplyCmtNotification() {
    try {
      const recipients = await this.getRecipientInfoByCmtNum();

      await this.sendReplyCmtNotification(recipients);

      return { success: true, msg: '답글 알림이 생성되었습니다.' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async getRecipientInfoByCmtNum() {
    const { params } = this;

    const recipients =
      await NotificationStorage.findRecipientNamesByCmtAndBoardNum(
        params.cmtNum,
        params.boardNum
      );

    return recipients;
  }

  async sendReplyCmtNotification(recipients) {
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
      recipientName: recipient.name,
      recipientId: recipient.id,
      title: recipient.description,
      content: replyCmt.description,
      url: `${params.category}/${params.boardNum}`,
      notiCategoryNum: replyCmt.notiCategoryNum,
    };

    if (category === 4) {
      notification.url = `${params.category}?id=${params.boardNum}`;
    }

    return notification;
  }

  async createLikeNotification() {
    try {
      const recipientInfo = await this.getLikeRecipientInfo();

      const notification = await this.getLikeNotificationInfo(recipientInfo);

      await this.sendLikeAndCmtNotification(notification);

      return { success: true, msg: '좋아요 알림이 생성되었습니다.' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async getLikeRecipientInfo() {
    const { params } = this;
    let recipientInfo;

    if (params.boardNum) {
      recipientInfo = await NotificationStorage.findBoardInfoByBoardNum(
        params.boardNum
      );
    }
    if (params.cmtNum) {
      recipientInfo = await NotificationStorage.findAllByCmtNum(params.cmtNum);
    }
    if (params.replyCmtNum) {
      recipientInfo = await NotificationStorage.findAllByCmtNum(
        params.replyCmtNum
      );
    }

    return recipientInfo;
  }

  async getLikeNotificationInfo(recipientInfo) {
    const { params } = this;
    const category = boardCategory[params.category];

    const notification = {
      senderName: this.auth.name,
      recipientName: recipientInfo.name,
      recipientId: recipientInfo.id,
      title: recipientInfo.description || recipientInfo.title,
      content: '좋아요❤️',
      url: `${params.category}/${recipientInfo.boardNum}`,
      notiCategoryNum: this.body.notiCategoryNum,
    };

    if (category === 4) {
      notification.url = `${params.category}?id=${recipientInfo.boardNum}`;
    }

    return notification;
  }

  async createJoinNotification() {
    const { notiCategoryNum } = this.body;
    const { clubNum } = this.params;

    try {
      if (notiCategoryNum === 2) {
        const recipients = await NotificationStorage.findAllByClubNum(clubNum);

        await this.sendJoinApproveNotification(recipients);

        return { success: true, msg: '동아리가입 승인알림이 생성되었습니다.' };
      }

      if (notiCategoryNum === 3) {
        const notification = await this.getJoinRejectNotificationInfo();

        await NotificationStorage.createNotification(notification);

        return { success: true, msg: '동아리가입 거절알림이 생성되었습니다.' };
      }
      return { success: false, msg: '동아리가입 알림에 대한 요청이 아닙니다.' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async sendJoinApproveNotification(recipients) {
    const senderId = this.auth.id;
    const { applicant } = this.body;

    recipients.forEach(async (recipient) => {
      if (senderId !== recipient.id) {
        const notification = await this.getJoinApproveNotificationInfo(
          recipient
        );

        if (recipient.id === applicant) {
          notification.content = '동아리 가입을 축하합니다.🎊';
        }
        await NotificationStorage.createNotification(notification);
      }
    });
  }

  async getJoinApproveNotificationInfo(recipient) {
    const applicantInfo = {
      clubNum: this.params.clubNum,
      id: this.body.applicant,
    };
    const { notiCategoryNum } = this.body;

    const { clubName } = await NotificationStorage.findClubInfoByClubNum(
      applicantInfo.clubNum
    );

    const applicantName =
      await NotificationStorage.findApplicantNameByClubNumAndId(applicantInfo);

    return {
      notiCategoryNum,
      senderName: this.auth.name,
      recipientId: recipient.id,
      recipientName: recipient.name,
      title: clubName,
      content: `${applicantName}님 가입`,
      url: `clubhome/${applicantInfo.clubNum}`,
    };
  }

  async getJoinRejectNotificationInfo() {
    const applicantInfo = {
      clubNum: this.params.clubNum,
      id: this.body.applicant,
    };
    const { notiCategoryNum } = this.body;

    const { clubName } = await NotificationStorage.findClubInfoByClubNum(
      applicantInfo.clubNum
    );

    const applicantName =
      await NotificationStorage.findApplicantNameByClubNumAndId(applicantInfo);

    return {
      notiCategoryNum,
      senderName: this.auth.name,
      recipientId: applicantInfo.id,
      recipientName: applicantName,
      title: clubName,
      content: '동아리가입 신청결과',
      url: '',
    };
  }

  async createScheduleNotification() {
    const { clubNum } = this.params;
    const { notiCategoryNum } = this.body;

    try {
      if (notiCategoryNum === 4 || notiCategoryNum === 5) {
        const recipients = await NotificationStorage.findAllByClubNum(clubNum);

        await this.sendSchedulenotification(recipients);

        return { success: true, msg: '일정에 대한 알림이 생성되었습니다.' };
      }
      return { success: false, msg: '일정알림에 대한 요청이 아닙니다.' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async sendSchedulenotification(recipients) {
    const senderId = this.auth.id;

    recipients.forEach(async (recipient) => {
      if (senderId !== recipient.id) {
        const notification = await this.getScheduleNotification(recipient);

        await NotificationStorage.createNotification(notification);
      }
    });
  }

  async getScheduleNotification(recipient) {
    const { clubNum } = this.params;
    const schedule = this.body;

    const { clubName } = await NotificationStorage.findClubInfoByClubNum(
      clubNum
    );

    return {
      senderName: this.auth.name,
      recipientId: recipient.id,
      recipientName: recipient.name,
      title: clubName,
      content: schedule.title,
      url: `clubhome/${clubNum}`,
      notiCategoryNum: schedule.notiCategoryNum,
    };
  }

  async createClubResignNotification() {
    try {
      const notification = await this.getClubResignNotificationInfo();

      const isCreate = await NotificationStorage.createNotification(
        notification
      );

      if (isCreate) {
        return { success: true, msg: '동아리탈퇴 알림이 생성되었습니다.' };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async getClubResignNotificationInfo() {
    const { notiCategoryNum } = this.body;

    const { clubName, leaderName, leaderId } =
      await NotificationStorage.findClubInfoByClubNum(this.params.clubNum);

    return {
      notiCategoryNum,
      title: clubName,
      senderName: this.auth.name,
      recipientName: leaderName,
      recipientId: leaderId,
      content: '동아리 탈퇴',
      url: '',
    };
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
