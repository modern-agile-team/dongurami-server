'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./review.ctrl');
const loginAuth = require('../../middlewares/login-auth');
const clubAuth = require('../../middlewares/club-auth');
const apiAuth = require('../../middlewares/api-auth');

router.get(
  '/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.findOneByClubNum
);

router.post(
  '/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.createByReview
);

router.put(
  '/:clubNum/:num',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.updateById
);

router.delete(
  '/:clubNum/:num',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.deleteByNum
);

module.exports = router;
