'use strict';

const express = require('express');
const ctrl = require('./board.ctrl');

const router = express.Router();

router.post('/:category', ctrl.process.createBoardNum);

router.get('/:category/:sort/:order', ctrl.process.findAllByCategoryNum);
router.get(
  '/promotion/:category/:sort/:order',
  ctrl.process.findAllByPromotionCategory
);
router.get('/:category/:boardNum', ctrl.process.findOneByBoardNum);

router.put('/:category/:boardNum', ctrl.process.updateOneByBoardNum);

router.delete('/:category/:boardNum', ctrl.process.deleteOneByBoardNum);

module.exports = router;
