'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./notification.ctrl');
const loginAuth = require('../../middlewares/login-auth');
const apiAuth = require('../../middlewares/api-auth');

router.get(
  '/entire',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.findAllById
);

router.patch(
  '/:notificationNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.updateOneByNotificationNum
);

router.put(
  '/entire',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.updateAllById
);

router.post(
  '/board/notice/:boardNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createNoticeBoardNotification
);

router.post(
  '/board/club-notice/:clubNum/:boardNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createClubNoticeNotification
);

router.post(
  '/comment/:category/:boardNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createCmtNotification
);

router.post(
  '/reply-comment/:category/:boardNum/:cmtNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createReplyCmtNotification
);

router.post(
  '/like/board/:category/:boardNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createLikeNotificationByBoardNum
);

router.post(
  '/like/comment/:category/:cmtNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createLikeNotificationByCmtNum
);

router.post(
  '/like/reply-comment/:category/:replyCmtNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createLikeNotificationByReplyCmtNum
);

router.post(
  '/join-club/result/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createJoinResultNotification
);

router.post(
  '/join-club/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createJoinNotification
);

router.post(
  '/schedule/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createScheduleNotification
);

router.post(
  '/resign-club/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createClubResignNotification
);

module.exports = router;
