'use strict';

const express = require('express');
const boardCtrl = require('./board.ctrl');
const commentCtrl = require('./comment.ctrl');
const identityCheck = require('../../middlewares/identify-auth');
const loginCheck = require('../../middlewares/login-auth');

const router = express.Router();

router.post(
  '/:category',
  loginCheck.loginCheck,
  boardCtrl.process.createBoardNum
);
router.post(
  '/:category/:boardNum',
  loginCheck.loginCheck,
  commentCtrl.process.createCommentNum
);
router.post(
  '/:category/:boardNum/:cmtNum',
  loginCheck.loginCheck,
  commentCtrl.process.createReplyCommentNum
);

router.get(
  '/:category',
  identityCheck.identityCheck,
  boardCtrl.process.findAllByCategoryNum
);
router.get(
  '/promotion/:clubCategory/:sort/:order',
  identityCheck.identityCheck,
  boardCtrl.process.findAllByPromotionCategory
);
router.get(
  '/:category/:boardNum',
  identityCheck.identityCheck,
  boardCtrl.process.findOneByBoardNum
);

router.put(
  '/:category/:boardNum',
  loginCheck.loginCheck,
  boardCtrl.process.updateOneByBoardNum
);
router.put(
  '/:category/:boardNum/:cmtNum',
  loginCheck.loginCheck,
  commentCtrl.process.updateByCommentNum
);
router.put(
  '/:category/:boardNum/:cmtNum/:replyCmtNum',
  loginCheck.loginCheck,
  commentCtrl.process.updateByReplyCommentNum
);

router.delete(
  '/:category/:boardNum',
  loginCheck.loginCheck,
  boardCtrl.process.deleteOneByBoardNum
);
router.delete(
  '/:category/:boardNum/:cmtNum',
  loginCheck.loginCheck,
  commentCtrl.process.deleteAllByGroupNum
);
router.delete(
  '/:category/:boardNum/:cmtNum/:replyCmtNum',
  loginCheck.loginCheck,
  commentCtrl.process.deleteOneReplyCommentNum
);

module.exports = router;
