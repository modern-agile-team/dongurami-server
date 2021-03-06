'use strict';

const express = require('express');
const loginAuth = require('../../middlewares/login-auth');
const apiAuth = require('../../middlewares/api-auth');
const ctrl = require('./emotion.ctrl');

const router = express.Router();

router.patch(
  '/liked/board/:boardNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.likedByBoardNum
);
router.patch(
  '/unliked/board/:boardNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.unLikedByBoardNum
);

router.patch(
  '/liked/comment/:cmtNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.likedByCmtNum
);
router.patch(
  '/unliked/comment/:cmtNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.unLikedByCmtNum
);

router.patch(
  '/liked/reply-comment/:replyCmtNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.likedByReplyCmtNum
);
router.patch(
  '/unliked/reply-comment/:replyCmtNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.unLikedByReplyCmtNum
);

module.exports = router;
