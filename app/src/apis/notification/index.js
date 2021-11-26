'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./notification.ctrl');
const loginAuth = require('../../middlewares/login-auth');
const apiAuth = require('../../middlewares/api-auth');

router.get(
  '/entire',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.findAllById
);

router.patch(
  '/:notificationNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.updateOneByNotificationNum
);

router.put(
  '/entire',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.updateAllById
);

module.exports = router;
