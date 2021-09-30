'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./notification.ctrl');
const loginAuth = require('../../middlewares/login-auth');

router.get('/', loginAuth.loginCheck, ctrl.process.findAllById);

router.delete(
  '/:notificationNum',
  loginAuth.loginCheck,
  ctrl.process.deleteByNotificationNum
);
router.delete('/entire', loginAuth.loginCheck, ctrl.process.deleteAllById);

module.exports = router;
