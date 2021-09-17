'use stirct';

const express = require('express');

const router = express.Router();
const ctrl = require('./schedule.ctrl');
// 로그인 인증 미들웨어
const loginAuth = require('../../middlewares/login-auth');
// 동아리 가입 인증 미들웨어
const clubAuth = require('../../middlewares/club-auth');

router.post('/:clubNum', loginAuth.loginCheck, ctrl.process.createSchedule);

router.get(
  '/:clubNum',
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.findAllByClubNum
);
router.get(
  '/:clubNum/:date',
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.findAllByDate
);

router.put('/:clubNum/:no', loginAuth.loginCheck, ctrl.process.updateSchedule);
router.patch(
  '/:clubNum/:no',
  loginAuth.loginCheck,
  ctrl.process.updateOnlyImportant
);

router.delete(
  '/:clubNum/:no',
  loginAuth.loginCheck,
  ctrl.process.deleteSchedule
);

module.exports = router;
