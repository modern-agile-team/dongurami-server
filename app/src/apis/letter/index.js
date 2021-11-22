'use strict';

const express = require('express');

const router = express.Router();
const loginAuth = require('../../middlewares/login-auth');
const letterCtrl = require('./letter.ctrl');

router.get(
  '/entire',
  loginAuth.loginCheck,
  letterCtrl.process.findLetterNotifications
);

router.put(
  '/entire',
  loginAuth.loginCheck,
  letterCtrl.process.deleteLetterNotifications
);

router.get('/:id', loginAuth.loginCheck, letterCtrl.process.findLetters);
router.get(
  '/:id/:letterNo',
  loginAuth.loginCheck,
  letterCtrl.process.findLettersByGroup
);

router.post('/', loginAuth.loginCheck, letterCtrl.process.createLetter);
router.post(
  '/:id/:letterNo',
  loginAuth.loginCheck,
  letterCtrl.process.createReplyLetter
);

router.put(
  '/:id/:letterNo',
  loginAuth.loginCheck,
  letterCtrl.process.deleteLetters
);

module.exports = router;
