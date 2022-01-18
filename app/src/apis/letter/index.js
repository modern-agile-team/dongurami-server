'use strict';

const express = require('express');

const router = express.Router();
const apiAuth = require('../../middlewares/api-auth');
const loginAuth = require('../../middlewares/login-auth');
const letterCtrl = require('./letter.ctrl');

router.get(
  '/entire',

  loginAuth.loginCheck,
  letterCtrl.process.findLetterNotifications
);

router.get(
  '/:id',

  loginAuth.loginCheck,
  letterCtrl.process.findAllLetterList
);

router.get(
  '/:id/:groupNo',

  loginAuth.loginCheck,
  letterCtrl.process.findLettersByGroup
);

router.post(
  '/',

  loginAuth.loginCheck,
  letterCtrl.process.createLetter
);

router.post(
  '/:id/:groupNo',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  letterCtrl.process.createReplyLetter
);

router.put(
  '/entire',

  loginAuth.loginCheck,
  letterCtrl.process.deleteLetterNotifications
);

router.delete(
  '/:id/:groupNo',

  loginAuth.loginCheck,
  letterCtrl.process.deleteLettersByGroupNo
);

module.exports = router;
