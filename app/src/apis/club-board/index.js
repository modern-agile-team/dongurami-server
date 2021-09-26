'use strict';

const express = require('express');
const ctrl = require('../boards/board.ctrl');

const router = express.Router();

router.get(
  '/:category/:clubNum/:sort/:order',
  ctrl.process.findAllByCategoryNum
);
router.get(
  '/:category/:clubNum/:boardNum/:sort/:order',
  ctrl.process.findOneByBoardNum
);

router.post('/:category/:clubNum', ctrl.process.createBoardNum);

module.exports = router;
