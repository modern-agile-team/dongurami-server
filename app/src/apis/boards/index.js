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
router.get('/:category/:num', ctrl.process.findOneByBoardNum);

router.put('/:category/:num', ctrl.process.updateOneByNum);

router.delete('/:category/:num', ctrl.process.deleteOneByNum);

module.exports = router;
