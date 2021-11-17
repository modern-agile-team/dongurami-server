'use strict';

const express = requrie('express');
const router = express.Router();
const loginAuth = require('../../middlewares/login-auth');
const letterCtrl = require('./letter.ctrl');

router.get('/:id', loginAuth.loginCheck, letterCtrl.process.findLetters);

router.post('send', loginAuth.loginCheck, letterCtrl.process.createLetter);

module.exports = router;
