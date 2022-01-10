'use stirct';

const express = require('express');

const router = express.Router();
const ctrl = require('./home.ctrl');
const apiAuth = require('../../middlewares/api-auth');
const loginAuth = require('../../middlewares/login-auth');
const clubAuth = require('../../middlewares/club-auth');

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
  clubAuth.clubJoinCheck,
  ctrl.process.updateClubIntroduce
);

router.put(
  '/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.updateClubLogo
);

module.exports = router;
