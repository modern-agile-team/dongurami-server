'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./root.ctrl');
const loginAuth = require('../../middlewares/login-auth');

router.get('/login-check', loginAuth.loginCheck, ctrl.process.resUserInfo);
router.post('/login', ctrl.process.login);
router.post('/sign-up', ctrl.process.signUp);

router.post('/find-id', ctrl.process.findId);

module.exports = router;
