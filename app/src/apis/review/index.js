'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./review.ctrl');
const loginAuth = require('../../middlewares/login-auth');
const clubAuth = require('../../middlewares/club-auth');

router.get('/:clubNum', loginAuth.loginCheck, ctrl.process.findOneByClubNum);

router.post(
  '/:clubNum',
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.createByReview
);

router.put('/:clubNum/:num', loginAuth.loginCheck, ctrl.process.updateById);

router.delete('/:clubNum/:num', loginAuth.loginCheck, ctrl.process.deleteByNum);

module.exports = router;
