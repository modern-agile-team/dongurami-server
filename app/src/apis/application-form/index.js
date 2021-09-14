'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./application.ctrl');
const loginAuth = require('../../middlewares/login-auth');

router.get('/:clubNum', loginAuth.loginCheck, ctrl.process.findAllByClubNum);

router.post('/:clubNum', ctrl.process.createQuestion);

module.exports = router;
