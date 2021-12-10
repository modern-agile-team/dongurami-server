'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./root.ctrl');
const loginAuth = require('../../middlewares/login-auth');
const signUpAuth = require('../../middlewares/signUp-auth');
const identityCheck = require('../../middlewares/identify-auth');
const apiAuth = require('../../middlewares/api-auth');

router.get(
  '/student',
  apiAuth.apiAuth,
  identityCheck.identityCheck,
  ctrl.process.getUserInfoByJWT
);

router.post('/login', apiAuth.apiAuth, ctrl.process.login);
router.post(
  '/sign-up',
  apiAuth.apiAuth,
  signUpAuth.signUpCheck,
  ctrl.process.signUp
);
router.post('/find-id', apiAuth.apiAuth, ctrl.process.findId);
router.post(
  '/forgot-password',
  apiAuth.apiAuth,
  ctrl.process.sendEmailForPassword
);

router.patch(
  '/reset-password',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.resetPassword
);
router.patch(
  '/find-password/:token',
  apiAuth.apiAuth,
  ctrl.process.findPassword
);

module.exports = router;
