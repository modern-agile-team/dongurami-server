'use strict';

const express = require('express');
const boardCtrl = require('./board.ctrl');
const commentCtrl = require('./comment.ctrl');

const router = express.Router();

router.post('/:category', boardCtrl.process.createBoardNum);
router.post('/:category/:boardNum', commentCtrl.process.createCommentNum);
router.post(
  '/:category/:boardNum/:cmtNum',
  commentCtrl.process.createReplyCommentNum
);

router.get('/:category/:sort/:order', boardCtrl.process.findAllByCategoryNum);
router.get(
  '/promotion/:category/:sort/:order',
  boardCtrl.process.findAllByPromotionCategory
);
router.get('/:category/:boardNum', boardCtrl.process.findOneByBoardNum);

router.put('/:category/:boardNum', boardCtrl.process.updateOneByBoardNum);
router.put(
  '/:category/:boardNum/:cmtNum',
  commentCtrl.process.updateByCommentNum
);

router.delete('/:category/:boardNum', boardCtrl.process.deleteOneByBoardNum);
router.delete(
  '/:category/:boardNum/:cmtNum',
  commentCtrl.process.deleteAllByGroupNum
);

module.exports = router;
