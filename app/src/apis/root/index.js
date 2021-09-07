'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./root.ctrl');
const auth = require('../../middlewares/login-auth');

// 로그인 성공 후 jwt 검증
router.get('/auth', auth.logined, ctrl.auth.resUserInfo);
router.get('/un-auth', auth.notLogined, ctrl.auth.resNoneUserInfo);

router.post('/login', ctrl.process.login);
router.post('/sign-up', ctrl.process.signUp);

module.exports = router;
