'use strict';

const express = require('express');
const ctrl = require('../boards/board.ctrl');
const commentCtrl = require('../boards/comment.ctrl');

const router = express.Router();

router.get(
  '/:category/:clubNum/:sort/:order',
  ctrl.process.findAllByCategoryNum
);
router.get('/:category/:clubNum/:boardNum', ctrl.process.findOneByBoardNum);

router.post('/:category/:clubNum', ctrl.process.createBoardNum);
router.post('/:category/:boardNum', commentCtrl.process.createCommentNum);
router.post(
  '/:category/:boardNum/:cmtNum',
  commentCtrl.process.createReplyCommentNum
);

router.put('/:category/:clubNum', ctrl.process.updateOneByBoardNum);
router.put(
  '/:category/:boardNum/:cmtNum',
  commentCtrl.process.updateByCommentNum
);
router.put(
  '/:category/:boardNum/:cmtNum/:replyCmtNum',
  commentCtrl.process.updateByReplyCommentNum
);

router.delete('/:category/:clubNum', ctrl.process.deleteOneByBoardNum);
router.delete(
  '/:category/:boardNum/:cmtNum',
  commentCtrl.process.deleteAllByGroupNum
);
router.delete(
  '/:category/:boardNum/:cmtNum/:replyCmtNum',
  commentCtrl.process.deleteOneReplyCommentNum
);

module.exports = router;
