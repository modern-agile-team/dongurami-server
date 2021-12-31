'use stirct';

const express = require('express');

const router = express.Router();
const ctrl = require('./home.ctrl');
const apiAuth = require('../../middlewares/api-auth');
const loginAuth = require('../../middlewares/login-auth');

router.get(
  '/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.findOneByClubNum
);

router.patch(
  '/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.updateClubIntroduce
);

router.put(
  '/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.updateClubLogo
);

module.exports = router;
