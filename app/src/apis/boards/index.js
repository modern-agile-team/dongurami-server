'use strict';

const express = require('express');
const ctrl = require('./board.ctrl');

const router = express.Router();

router.get('/promotion', ctrl.readPromotionList);

module.exports = router;
