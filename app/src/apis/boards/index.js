'use strict';

const express = require('express');
const ctrl = require('./board.ctrl');

const router = express.Router();

router.get('/:category', ctrl.findAllByCategoryNum);
router.get('/:category/:num', ctrl.findOneByBoardNum);

module.exports = router;
