'use strict';

const express = require('express');
const boardCtrl = require('./board.ctrl');
const commentCtrl = require('./comment.ctrl');
const identityCheck = require('../../middlewares/identify-auth');
const loginCheck = require('../../middlewares/login-auth');
const apiAuth = require('../../middlewares/api-auth');

const router = express.Router();

router.post(
  '/:category',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  boardCtrl.process.createBoardNum
);
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
  '/:category',
  apiAuth.apiAuth,
  identityCheck.identityCheck,
  boardCtrl.process.findAllByCategoryNum
);
router.get(
  '/promotion/club',
  apiAuth.apiAuth,
  identityCheck.identityCheck,
  boardCtrl.process.findAllByPromotionCategory
);
router.get(
  '/:category/:boardNum',
  apiAuth.apiAuth,
  identityCheck.identityCheck,
  boardCtrl.process.findOneByBoardNum
);

router.put(
  '/:category/:boardNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  boardCtrl.process.updateOneByBoardNum
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
router.patch(
  '/:category/:boardNum',
  apiAuth.apiAuth,
  boardCtrl.process.updateOnlyHitByNum
);

router.delete(
  '/:category/:boardNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  boardCtrl.process.deleteOneByBoardNum
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
