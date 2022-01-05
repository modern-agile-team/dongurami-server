'use stirct';

const express = require('express');

const router = express.Router();
const ctrl = require('./schedule.ctrl');
const apiAuth = require('../../middlewares/api-auth');
const loginAuth = require('../../middlewares/login-auth');
const clubAuth = require('../../middlewares/club-auth');

router.post(
  '/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.createSchedule
);

router.get(
  '/:clubNum/:date',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.findAllScheduleByDate
);

router.put(
  '/:clubNum/:no',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.updateSchedule
);
router.patch(
  '/:clubNum/:no',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.updateOnlyImportant
);

router.delete(
  '/:clubNum/:no',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.deleteSchedule
);

module.exports = router;
