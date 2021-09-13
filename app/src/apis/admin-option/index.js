'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./admin-option.ctrl');
// const loginAuth = require('../../middlewares/login-auth');
// const clubAuth = require('../../middlewares/club-auth');

router.get(
  '/:clubNum',
  ctrl.process.checkClubAdmin,
  ctrl.process.findOneAdminByClubNum
);
// router.put('/:clubNum/', loginAuth.loginCheck, ctrl.process.updateById);
module.exports = router;
