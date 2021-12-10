'use strict';

const express = require('express');

const ctrl = require('./profile.ctrl');
const identityCheck = require('../../middlewares/identify-auth');
const loginCheck = require('../../middlewares/login-auth');
const apiAuth = require('../../middlewares/api-auth');

const router = express.Router();

router.get(
  '/:studentId',
  apiAuth.apiAuth,
  identityCheck.identityCheck,
  ctrl.process.findOneByStudentId
);

router.put(
  '/:studentId',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  ctrl.process.updateStudentInfo
);

module.exports = router;
