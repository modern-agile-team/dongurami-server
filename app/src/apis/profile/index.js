'use strict';

const express = require('express');

const ctrl = require('./profile.ctrl');
const identityCheck = require('../../middlewares/identify-auth');
// const loginCheck = require('../../middlewares/login-auth');

const router = express.Router();

router.get(
  '/:studentId',
  identityCheck.identityCheck,
  ctrl.process.findOneByStudentId
);

module.exports = router;
