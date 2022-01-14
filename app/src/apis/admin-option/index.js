'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./admin-option.ctrl');
const loginAuth = require('../../middlewares/login-auth');
const clubAuth = require('../../middlewares/club-auth');
const apiAuth = require('../../middlewares/api-auth');

router.get(
  '/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.checkClubAdmin,
  ctrl.process.findOneByClubNum
);

router.post(
  '/:clubNum/applicant',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.createMemberById
);

router.put(
  '/:clubNum/leader',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.updateLeaderById
);

router.put(
  '/:clubNum/admin-functions',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.updateAdminOptionById
);

router.put(
  '/:clubNum/applicant',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.updateRejectedApplicantById
);

router.delete(
  '/:clubNum/:memberId',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  ctrl.process.deleteMemberById
);

module.exports = router;
