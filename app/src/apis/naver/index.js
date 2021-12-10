'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./naver.ctrl');
const snsTokenAuth = require('../../middlewares/snsToken-auth');
const apiAuth = require('../../middlewares/api-auth');

router.get(
  '/login',
  apiAuth.apiAuth,
  snsTokenAuth.snsTokenCheck,
  ctrl.process.login
);
router.post('/sign-up', apiAuth.apiAuth, ctrl.process.signUp);

module.exports = router;
