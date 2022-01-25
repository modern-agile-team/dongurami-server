'use strict';

const express = require('express');
const boardCtrl = require('../board/board.ctrl');
const commentCtrl = require('../comment/comment.ctrl');
const myPageCtrl = require('../my-page/my-page.ctrl');
const apiAuth = require('../../middlewares/api-auth');
const loginCheck = require('../../middlewares/login-auth');
const clubJoinCheck = require('../../middlewares/club-auth');

const router = express.Router();

router.get(
  '/:category/:clubNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  boardCtrl.process.findAllByCategoryNum
);
router.get(
  '/:category/:clubNum/:boardNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  boardCtrl.process.findOneByBoardNum
);

router.post(
  '/:category/:clubNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  boardCtrl.process.createBoardNum
);
router.post(
  '/:clubNum/comment',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.createCommentNum
);
router.post(
  '/:clubNum/comment/reply-comment',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.createReplyCommentNum
);

router.post(
  '/:category/personal/scrap/:clubNum/:boardNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  clubJoinCheck.clubJoinCheck,
  myPageCtrl.process.createScrapNum
);

router.put(
  '/:category/:clubNum/:boardNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  boardCtrl.process.updateOneByBoardNum
);
router.put(
  '/:clubNum/comment',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.updateByCommentNum
);
router.put(
  '/:clubNum/comment/reply-comment',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.updateByReplyCommentNum
);

router.delete(
  '/:category/:clubNum/:boardNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  boardCtrl.process.deleteOneByBoardNum
);
router.delete(
  '/:clubNum/comment',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.deleteAllByGroupNum
);
router.delete(
  '/:clubNum/comment/reply-comment',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  commentCtrl.process.deleteOneReplyCommentNum
);

module.exports = router;
