'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./root.ctrl');
const loginAuth = require('../../middlewares/login-auth');
const signUpAuth = require('../../middlewares/signUp-auth');

router.get('/student', loginAuth.loginCheck, ctrl.process.getUserInfoByJWT);
router.get('/login-check', loginAuth.loginCheck, ctrl.process.resUserInfo);
router.get('/naver-login', ctrl.process.naverLogin);

router.post('/login', ctrl.process.login);
router.post('/sign-up', signUpAuth.signUpCheck, ctrl.process.signUp);
router.post('/find-id', ctrl.process.findId);
router.post('/forgot-password', ctrl.process.sendEmailForPassword);

router.patch(
  '/reset-password',
  loginAuth.loginCheck,
  ctrl.process.resetPassword
);
router.patch('/find-password/:token', ctrl.process.findPassword);

module.exports = router;
