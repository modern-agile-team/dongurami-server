'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./signup.ctrl');

// 회원가입 API
router.post('/signup', ctrl.process.signup);

module.exports = router;
