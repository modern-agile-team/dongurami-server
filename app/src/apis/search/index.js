'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./search.ctrl');

router.get('/:category', ctrl.process.search);
router.get('/promotion/category', ctrl.process.promotionSearch);
router.get('/club-list/category', ctrl.process.clubListSearch);

module.exports = router;
