'use strict';

const express = require('express');
const loginAuth = require('../../middlewares/login-auth');
const ctrl = require('./emotion.ctrl');

const router = express.Router();

router.patch(
  '/liked/board/:boardNum',
  loginAuth.loginCheck,
  ctrl.process.likedByBoardNum
);
router.patch(
  '/liked/comment/:cmtNum',
  loginAuth.loginCheck,
  ctrl.process.likedByCmtNum
);
router.patch(
  '/liked/reply-comment/:replyCmtNum',
  loginAuth.loginCheck,
  ctrl.process.likedByReplyCmtNum
);
router.patch(
  '/unliked/board/:boardNum',
  loginAuth.loginCheck,
  ctrl.process.unLikedByBoardNum
);
router.patch(
  '/unliked/comment/:cmtNum',
  loginAuth.loginCheck,
  ctrl.process.unLikedByCmtNum
);
router.patch(
  '/unliked/reply-comment/:replyCmtNum',
  loginAuth.loginCheck,
  ctrl.process.unLikedByReplyCmtNum
);

module.exports = router;
