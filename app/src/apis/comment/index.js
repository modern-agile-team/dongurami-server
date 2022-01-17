'use strict';

const express = require('express');
const commentCtrl = require('./comment.ctrl');
const identityCheck = require('../../middlewares/identify-auth');
const loginCheck = require('../../middlewares/login-auth');
const apiAuth = require('../../middlewares/api-auth');

const router = express.Router();

router.post(
  '/:category/:boardNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.createCommentNum
);
router.post(
  '/:category/:boardNum/:cmtNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.createReplyCommentNum
);

router.get(
  '/category/:boardNum',
  apiAuth.apiAuth,
  identityCheck.identityCheck,
  commentCtrl.process.findAllByBoardNum
);

router.put(
  '/:category/:boardNum/:cmtNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.updateByCommentNum
);
router.put(
  '/:category/:boardNum/:cmtNum/:replyCmtNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.updateByReplyCommentNum
);

router.delete(
  '/:category/:boardNum/:cmtNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.deleteAllByGroupNum
);
router.delete(
  '/:category/:boardNum/:cmtNum/:replyCmtNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.deleteOneReplyCommentNum
);

module.exports = router;
