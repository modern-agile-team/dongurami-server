'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./signUp.ctrl');

// 회원가입 API
router.post('/signUp', ctrl.process.signUp);

module.exports = router;
