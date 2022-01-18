'use strict';

const express = require('express');
const commentCtrl = require('./comment.ctrl');
const identityCheck = require('../../middlewares/identify-auth');
const loginCheck = require('../../middlewares/login-auth');
const apiAuth = require('../../middlewares/api-auth');

const router = express.Router();

router.post(
  '/',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.createCommentNum
);
router.post(
  '/reply-comment',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.createReplyCommentNum
);

router.get(
  '/',
  apiAuth.apiAuth,
  identityCheck.identityCheck,
  commentCtrl.process.findAllByBoardNum
);

router.put(
  '/',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.updateByCommentNum
);
router.put(
  '/reply-comment',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.updateByReplyCommentNum
);

router.delete(
  '/',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.deleteAllByGroupNum
);
router.delete(
  '/reply-comment',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.deleteOneReplyCommentNum
);

module.exports = router;
