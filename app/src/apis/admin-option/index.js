'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./admin-option.ctrl');
const loginAuth = require('../../middlewares/login-auth');
const clubAuth = require('../../middlewares/club-auth');

router.get(
  '/:clubNum',
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.checkClubAdmin,
  ctrl.process.findOneByClubNum
);

router.put(
  '/:clubNum/leader',
  loginAuth.loginCheck,
  ctrl.process.updateLeaderById
);

router.put(
  '/:clubNum/admin-functions',
  loginAuth.loginCheck,
  ctrl.process.updateAdminOptionById
);

router.post(
  '/:clubNum/applicant',
  loginAuth.loginCheck,
  ctrl.process.createMemberById
);

router.put(
  '/:clubNum/applicant',
  loginAuth.loginCheck,
  ctrl.process.updateApplicantById
);

router.delete(
  '/:clubNum/member',
  loginAuth.loginCheck,
  ctrl.process.deleteMemberById
);

module.exports = router;
