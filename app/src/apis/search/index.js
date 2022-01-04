'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./search.ctrl');
const apiAuth = require('../../middlewares/api-auth');

router.get('/:category', apiAuth.apiAuth, ctrl.process.findAllSearch);
router.get(
  '/promotion/category',
  apiAuth.apiAuth,
  ctrl.process.findAllPromotionSearch
);
router.get(
  '/club-list/:keyword',
  apiAuth.apiAuth,
  ctrl.process.findAllClubList
);

module.exports = router;
