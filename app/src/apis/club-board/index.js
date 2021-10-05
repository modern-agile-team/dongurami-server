'use strict';

const express = require('express');
const boardCtrl = require('../boards/board.ctrl');
const commentCtrl = require('../boards/comment.ctrl');
const loginCheck = require('../../middlewares/login-auth');

const router = express.Router();

router.get(
  '/:category/:clubNum/:sort/:order',
  loginCheck.loginCheck,
  boardCtrl.process.findAllByCategoryNum
);
router.get(
  '/:category/:clubNum/:boardNum',
  loginCheck.loginCheck,
  boardCtrl.process.findOneByBoardNum
);

router.post(
  '/:category/:clubNum',
  loginCheck.loginCheck,
  boardCtrl.process.createBoardNum
);
router.post(
  '/:category/:clubNum/:boardNum',
  loginCheck.loginCheck,
  commentCtrl.process.createCommentNum
);
router.post(
  '/:category/:clubNum/:boardNum/:cmtNum',
  loginCheck.loginCheck,
  commentCtrl.process.createReplyCommentNum
);

router.put(
  '/:category/:clubNum/:boardNum',
  loginCheck.loginCheck,
  boardCtrl.process.updateOneByBoardNum
);
router.put(
  '/:category/:clubNum/:boardNum/:cmtNum',
  loginCheck.loginCheck,
  commentCtrl.process.updateByCommentNum
);
router.put(
  '/:category/:clubNum/:boardNum/:cmtNum/:replyCmtNum',
  loginCheck.loginCheck,
  commentCtrl.process.updateByReplyCommentNum
);

router.delete(
  '/:category/:clubNum/:boardNum',
  loginCheck.loginCheck,
  boardCtrl.process.deleteOneByBoardNum
);
router.delete(
  '/:category/:clubNum/:boardNum/:cmtNum',
  loginCheck.loginCheck,
  commentCtrl.process.deleteAllByGroupNum
);
router.delete(
  '/:category/:clubNum/:boardNum/:cmtNum/:replyCmtNum',
  loginCheck.loginCheck,
  commentCtrl.process.deleteOneReplyCommentNum
);

module.exports = router;
