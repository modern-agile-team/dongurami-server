'use strict';

const NotificationStorage = require('./NotificationStorage');
const Error = require('../../utils/Error');
const WriterCheck = require('../../utils/WriterCheck');
const boardCategory = require('../Category/board');
const makeResponse = require('../../utils/makeResponse');

class Notification {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async createNoticeBoardNotification() {
    const { notiCategoryNum } = this.body;

    try {
      if (notiCategoryNum === 12) {
        const recipients = await NotificationStorage.findAllStudentNameAndId();

        await this.sendBoardNotification(recipients);

        return makeResponse(201, '전체공지 알림이 생성되었습니다.');
      }
      return makeResponse(400, '전체공지 생성 알림에 대한 요청이 아닙니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async createClubNoticeBoardNotification() {
    const { clubNum } = this.params;
    const { notiCategoryNum } = this.body;

    try {
      if (notiCategoryNum === 6) {
        const recipients = await NotificationStorage.findAllMemberInfoByClubNum(
          clubNum
        );

        await this.sendBoardNotification(recipients);

        return makeResponse(201, '동아리공지 알림이 생성되었습니다.');
      }
      return makeResponse(400, '동아리공지 생성 알림에 대한 요청이 아닙니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async sendBoardNotification(recipients) {
    const senderId = this.auth.id;

    for (const recipient of recipients) {
      if (senderId !== recipient.id) {
        const notification = await this.getBoardNotificationInfo(recipient);

        await NotificationStorage.createNotification(notification);
      }
    }
  }

  async getBoardNotificationInfo(recipient) {
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
      notification.url = `clubhome/${clubNum}/notice/${board.no}`;
    }
    return notification;
  }

  async createCmtNotification() {
    const { notiCategoryNum } = this.body;

    try {
      if (notiCategoryNum === 0) {
        const notification = await this.getCmtNotificationInfo();

        await this.sendLikeAndCmtNotification(notification);

        return makeResponse(201, '댓글 알림이 생성되었습니다.');
      }
      return makeResponse(400, '댓글 생성 알림에 대한 요청이 아닙니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async getCmtNotificationInfo() {
    const { params } = this;
    const category = boardCategory[params.category];
    const comment = {
      description: this.body.cmtDescription,
      notiCategoryNum: this.body.notiCategoryNum,
      hiddenFlag: this.body.hiddenFlag,
    };
    const recipient = await NotificationStorage.findBoardInfoByBoardNum(
      params.boardNum
    );

    const notification = {
      senderName: this.auth.name,
      recipientName: recipient.name,
      recipientId: recipient.id,
      title: recipient.title,
      content: comment.description,
      url: `${params.category}/${params.boardNum}`,
      notiCategoryNum: comment.notiCategoryNum,
    };

    if (comment.hiddenFlag === 1) notification.senderName = '익명';

    if (category === 4) {
      notification.url = `${params.category}?id=${params.boardNum}`;
    }

    return notification;
  }

  async sendLikeAndCmtNotification(notification) {
    const senderId = this.auth.id;

    if (senderId !== notification.recipientId) {
      await NotificationStorage.createNotification(notification);
    }
  }

  async createReplyCmtNotification() {
    const { notiCategoryNum } = this.body;

    try {
      if (notiCategoryNum === 1) {
        const recipients = await this.getRecipientInfoByCmtNum();

        await this.sendReplyCmtNotification(recipients);

        return makeResponse(201, '답글 알림이 생성되었습니다.');
      }
      return makeResponse(400, '답글 생성 알림에 대한 요청이 아닙니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async getRecipientInfoByCmtNum() {
    const { params } = this;

    const recipients =
      await NotificationStorage.findRecipientNameByCmtAndBoardNum(
        params.cmtNum,
        params.boardNum
      );

    return recipients;
  }

  async sendReplyCmtNotification(recipients) {
    const senderId = this.auth.id;

    for (const recipient of recipients) {
      if (senderId !== recipient.id) {
        const notification = this.getReplyCmtNotificationInfo(recipient);

        await NotificationStorage.createNotification(notification);
      }
    }
  }

  getReplyCmtNotificationInfo(recipient) {
    const { params } = this;
    const category = boardCategory[params.category];
    const replyCmt = {
      description: this.body.replyCmtDescription,
      notiCategoryNum: this.body.notiCategoryNum,
      hiddenFlag: this.body.hiddenFlag,
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

    if (replyCmt.hiddenFlag === 1) notification.senderName = '익명';

    if (category === 4) {
      notification.url = `${params.category}?id=${params.boardNum}`;
    }

    return notification;
  }

  async createLikeNotification() {
    const { notiCategoryNum } = this.body;

    try {
      if (
        notiCategoryNum === 9 ||
        notiCategoryNum === 10 ||
        notiCategoryNum === 11
      ) {
        const recipientInfo = await this.getLikeRecipientInfo();

        const notification = await this.getLikeNotificationInfo(recipientInfo);

        await this.sendLikeAndCmtNotification(notification);

        return makeResponse(201, '좋아요 알림이 생성되었습니다.');
      }
      return makeResponse(400, '좋아요 생성 알림에 대한 요청이 아닙니다.');
    } catch (err) {
      return Error.ctrl('', err);
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

  async createJoinResultNotification() {
    const { notiCategoryNum } = this.body;
    const { clubNum } = this.params;

    try {
      if (notiCategoryNum === 2) {
        const recipients = await NotificationStorage.findAllMemberInfoByClubNum(
          clubNum
        );

        await this.sendJoinApproveNotification(recipients);

        return makeResponse(201, '동아리가입 승인 알림이 생성되었습니다.');
      }

      if (notiCategoryNum === 3) {
        const notification = await this.getJoinRejectNotificationInfo();

        await NotificationStorage.createNotification(notification);

        return makeResponse(201, '동아리가입 거절 알림이 생성되었습니다.');
      }
      return makeResponse(400, '동아리가입 결과 알림에 대한 요청이 아닙니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async sendJoinApproveNotification(recipients) {
    const senderId = this.auth.id;
    const { applicant } = this.body;

    for (const recipient of recipients) {
      if (senderId !== recipient.id) {
        const notification = await this.getJoinApproveNotificationInfo(
          recipient
        );

        if (recipient.id === applicant) {
          notification.content = '동아리 가입을 축하합니다.🎊';
        }
        await NotificationStorage.createNotification(notification);
      }
    }
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

  async createJoinNotification() {
    const { notiCategoryNum } = this.body;

    try {
      if (notiCategoryNum === 7) {
        const notification = await this.getJoinNotificationInfo();

        await NotificationStorage.createNotification(notification);

        return makeResponse(201, '가입 신청 알림이 생성되었습니다.');
      }
      return makeResponse(400, '가입 신청 알림에 대한 요청이 아닙니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async getJoinNotificationInfo() {
    const { clubNum } = this.params;
    const { notiCategoryNum } = this.body;

    const { clubName, leaderName, leaderId } =
      await NotificationStorage.findClubInfoByClubNum(clubNum);

    return {
      notiCategoryNum,
      senderName: this.auth.name,
      recipientName: leaderName,
      recipientId: leaderId,
      title: clubName,
      content: '동아리 가입 신청',
      url: `clubhome/${clubNum}`,
    };
  }

  async createScheduleNotification() {
    const { clubNum } = this.params;
    const { notiCategoryNum } = this.body;

    try {
      if (notiCategoryNum === 4 || notiCategoryNum === 5) {
        const recipients = await NotificationStorage.findAllMemberInfoByClubNum(
          clubNum
        );

        await this.sendScheduleNotification(recipients);

        return makeResponse(201, '일정에 대한 알림이 생성되었습니다.');
      }
      return makeResponse(400, '일정 알림에 대한 요청이 아닙니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async sendScheduleNotification(recipients) {
    const senderId = this.auth.id;

    for (const recipient of recipients) {
      if (senderId !== recipient.id) {
        const notification = await this.getScheduleNotification(recipient);

        await NotificationStorage.createNotification(notification);
      }
    }
  }

  async getScheduleNotification(recipient) {
    const { clubNum } = this.params;
    const { scheduleTitle } = this.body;
    const { notiCategoryNum } = this.body;

    const { clubName } = await NotificationStorage.findClubInfoByClubNum(
      clubNum
    );

    return {
      notiCategoryNum,
      senderName: this.auth.name,
      recipientId: recipient.id,
      recipientName: recipient.name,
      title: clubName,
      content: scheduleTitle,
      url: `clubhome/${clubNum}`,
    };
  }

  async createClubResignNotification() {
    const { notiCategoryNum } = this.body;

    try {
      if (notiCategoryNum === 8) {
        const notification = await this.getClubResignNotificationInfo();

        await NotificationStorage.createNotification(notification);

        return makeResponse(201, '동아리탈퇴 알림이 생성되었습니다.');
      }
      return makeResponse(400, '동아리탈퇴 알림에 대한 요청이 아닙니다.');
    } catch (err) {
      return Error.ctrl('', err);
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
        return makeResponse(200, '알림이 성공적으로 조회되었습니다.', {
          notifications,
        });
      }
      return makeResponse(
        400,
        '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.'
      );
    } catch (err) {
      return Error.ctrl('', err);
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

      if (isUpdate) return makeResponse(200, '읽은 알림이 삭제되었습니다.');
      return makeResponse(
        400,
        '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.'
      );
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateAllById() {
    const studentName = this.auth.name;

    try {
      const isUpdate = await NotificationStorage.updateAllById(studentName);

      if (isUpdate) return makeResponse(200, '전체 알림이 삭제되었습니다.');
      return makeResponse(
        400,
        '삭제 할 알림이 없거나 알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.'
      );
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Notification;
