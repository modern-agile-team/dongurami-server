'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./root.ctrl');
const auth = require('../../middlewares/auth-check');

router.get('/auth', auth.loggined, ctrl.auth.resUserInfo);
router.get('/un-auth', auth.notLoggined, ctrl.auth.resNoneUserInfo);

router.post('/login', ctrl.process.login);
router.post('/sign-up', ctrl.process.signUp);

module.exports = router;
