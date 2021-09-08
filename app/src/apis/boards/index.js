'use strict';

const express = require('express');
const ctrl = require('./board.ctrl');

const router = express.Router();

router.post('/:category', ctrl.process.createBoardNum);

router.get('/:category', ctrl.process.findAllByCategoryNum);
router.get('/:category/:num', ctrl.process.findOneByBoardNum);

router.put('/:category/:num', ctrl.process.updateOnlyByNum);

module.exports = router;
