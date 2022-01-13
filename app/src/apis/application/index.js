'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./application.ctrl');
const apiAuth = require('../../middlewares/api-auth');
const clubAuth = require('../../middlewares/club-auth');
const loginAuth = require('../../middlewares/login-auth');

router.get(
  '/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.findAllByClubNum
);

router.post(
  '/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.createQuestion
);

router.post(
  '/:clubNum/answer',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createAnswer
);

router.put(
  '/:clubNum/:questionNo',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.updateQuestion
);

router.delete(
  '/:clubNum/:questionNo',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.deleteQuestion
);

module.exports = router;
