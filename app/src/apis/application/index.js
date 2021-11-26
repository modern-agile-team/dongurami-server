'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./application.ctrl');
const apiAuth = require('../../middlewares/api-auth');
const loginAuth = require('../../middlewares/login-auth');

router.get(
  '/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.findAllByClubNum
);

// Only 회장
router.post(
  '/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createQuestion
);

// 가입 희망자
router.post(
  '/:clubNum/answer',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createAnswer
);

router.put(
  '/:clubNum/:no',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.updateQuestion
);

router.delete(
  '/:clubNum/:no',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.deleteQuestion
);

module.exports = router;
