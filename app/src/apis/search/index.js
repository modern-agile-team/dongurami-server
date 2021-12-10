'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./search.ctrl');
const apiAuth = require('../../middlewares/api-auth');

router.get('/:category', apiAuth.apiAuth, ctrl.process.search);
router.get(
  '/promotion/category',
  apiAuth.apiAuth,
  ctrl.process.promotionSearch
);
router.get('/club-list/category', apiAuth.apiAuth, ctrl.process.clubListSearch);

module.exports = router;
