'use strict';

const express = requrie('express');
const router = express.Router();
const loginAuth = require('../../middlewares/login-auth');
const letterCtrl = require('./letter.ctrl');

router.post('send', loginAuth.loginCheck, letterCtrl.process.createLetter);

module.exports = router;
