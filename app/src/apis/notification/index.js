'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./notification.ctrl');
const loginAuth = require('../../middlewares/login-auth');

router.get('/entire', loginAuth.loginCheck, ctrl.process.findAllById);

router.patch(
  '/:notificationNum',
  loginAuth.loginCheck,
  ctrl.process.updateOneByNotificationNum
);

router.put('/entire', loginAuth.loginCheck, ctrl.process.updateAllById);

module.exports = router;
