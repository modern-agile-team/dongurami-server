'use strict';

const express = require('express');
const ctrl = require('./board.ctrl');

const router = express.Router();

router.post('/:category', ctrl.process.createBoardNum);

router.get('/:category', ctrl.process.findAllByCategoryNum);
router.get('/:category/:num', ctrl.process.findOneByBoardNum);

module.exports = router;
