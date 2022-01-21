'use strict';

const express = require('express');
const imageCtrl = require('./image.ctrl');
const apiAuth = require('../../middlewares/api-auth');
const loginCheck = require('../../middlewares/login-auth');

const router = express.Router();

router.post(
  '/',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  imageCtrl.process.saveBoardImg
);

router.put(
  '/',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  imageCtrl.process.updateBoardImg
);

router.delete(
  '/',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  imageCtrl.process.deleteBoardImg
);

module.exports = router;
