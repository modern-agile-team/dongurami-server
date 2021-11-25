'use strict';

const express = require('express');
const loginAuth = require('../../middlewares/login-auth');
const ctrl = require('./emotion.ctrl');
const apiAuth = require('../../middlewares/api-auth');

const router = express.Router();

router.patch(
  '/liked/board/:boardNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.likedByBoardNum
);
router.patch(
  '/liked/comment/:cmtNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.likedByCmtNum
);
router.patch(
  '/liked/reply-comment/:replyCmtNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.likedByReplyCmtNum
);
router.patch(
  '/unliked/board/:boardNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.unLikedByBoardNum
);
router.patch(
  '/unliked/comment/:cmtNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.unLikedByCmtNum
);
router.patch(
  '/unliked/reply-comment/:replyCmtNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.unLikedByReplyCmtNum
);

module.exports = router;
