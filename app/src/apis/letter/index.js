'use strict';

const express = require('express');

const router = express.Router();
const apiAuth = require('../../middlewares/api-auth');
const loginAuth = require('../../middlewares/login-auth');
const letterCtrl = require('./letter.ctrl');

router.get(
  '/entire',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  letterCtrl.process.findLetterNotifications
);

router.get(
  '/:id',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  letterCtrl.process.findLetters
);

router.get(
  '/:id/:letterNo',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  letterCtrl.process.findLettersByGroup
);

router.post(
  '/',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  letterCtrl.process.createLetter
);

router.post(
  '/:id/:letterNo',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  letterCtrl.process.createReplyLetter
);

router.put(
  '/entire',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  letterCtrl.process.deleteLetterNotifications
);

router.put(
  '/:id/:letterNo',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  letterCtrl.process.deleteLetters
);

module.exports = router;
