'use strict';

const express = require('express');
const boardCtrl = require('./board.ctrl');
const commentCtrl = require('./comment.ctrl');

const router = express.Router();

router.post('/:category', boardCtrl.process.createBoardNum);
router.post('/:category/:num', commentCtrl.process.createCommentNum);

router.get('/:category/:sort/:order', boardCtrl.process.findAllByCategoryNum);
router.get(
  '/promotion/:category/:sort/:order',
  boardCtrl.process.findAllByPromotionCategory
);
router.get('/:category/:num', boardCtrl.process.findOneByBoardNum);

router.put('/:category/:num', boardCtrl.process.updateOneByNum);
router.put('/:category/:num/:cmtNum', commentCtrl.process.updateByCommentNum);

router.delete('/:category/:num', boardCtrl.process.deleteOneByNum);
router.delete(
  '/:category/:num/:cmtNum',
  commentCtrl.process.deleteAllByGroupNum
);

module.exports = router;
