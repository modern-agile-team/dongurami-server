'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./application.ctrl');
const loginAuth = require('../../middlewares/login-auth');

router.get('/:clubNum', loginAuth.loginCheck, ctrl.process.findAllByClubNum);

// Only 회장
router.post('/:clubNum', loginAuth.loginCheck, ctrl.process.createQuestion);

router.put('/:clubNum/:no', loginAuth.loginCheck, ctrl.process.updateQuestion);

router.delete(
  '/:clubNum/:no',
  loginAuth.loginCheck,
  ctrl.process.deleteQuestion
);

// 가입 희망자
router.post(
  '/:clubNum/answer',
  loginAuth.loginCheck,
  ctrl.process.createAnswer
);

module.exports = router;
