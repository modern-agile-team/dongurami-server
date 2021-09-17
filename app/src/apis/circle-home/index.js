'use stirct';

const express = require('express');

const router = express.Router();
const ctrl = require('./home.ctrl');
// 로그인 인증 미들웨어
const loginAuth = require('../../middlewares/login-auth');

router.get('/:clubNum', loginAuth.loginCheck, ctrl.process.findOneByClubNum);
router.put('/:clubNum', loginAuth.loginCheck, ctrl.process.updateClubInfo);

module.exports = router;
