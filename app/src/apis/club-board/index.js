'use strict';

const express = require('express');
const boardCtrl = require('../boards/board.ctrl');
const commentCtrl = require('../boards/comment.ctrl');
const myPageCtrl = require('../my-page/my-page.ctrl');
const loginCheck = require('../../middlewares/login-auth');
const clubJoinCheck = require('../../middlewares/club-auth');

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

// 동아리 별 활동 일지 스크랩 요청 API
router.post(
  '/:category/personal/scrap/:clubNum/:boardNum',
  loginCheck.loginCheck,
  clubJoinCheck.clubJoinCheck,
  myPageCtrl.process.createScrapNum
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
