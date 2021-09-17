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
// 동아리 회장 변경
router.put(
  '/:clubNum/leader',
  loginAuth.loginCheck,
  ctrl.process.updateLeaderById
);
// 동아리 권한 변경
router.put(
  '/:clubNum/admin-functions',
  loginAuth.loginCheck,
  ctrl.process.updateAdminOptionById
);
// 가입신청 승인
router.post(
  '/:clubNum/accepted-applicant',
  loginAuth.loginCheck,
  ctrl.process.createMemberById
);
// 가입신청 거절
router.put(
  '/:clubNum/rejected-applicant',
  loginAuth.loginCheck,
  ctrl.process.updateApplicantById
);

module.exports = router;
