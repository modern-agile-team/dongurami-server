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
  '/board/:boardNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createNoticeBoardNotification
);

router.post(
  '/board/:clubNum/:boardNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createClubBoardNotification
);

router.post(
  '/cmt/:category/:boardNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createCmtNotification
);

router.post(
  '/reply-cmt/:category/:boardNum/:cmtNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createReplyCmtNotification
);

module.exports = router;
