'use strict';

const express = require('express');
const ctrl = require('../boards/board.ctrl');

const router = express.Router();

router.get('/:category/:clubNum', ctrl.process.findAllByCategoryNum);

router.post('/:category/:clubNum', ctrl.process.createBoardNum);

module.exports = router;
