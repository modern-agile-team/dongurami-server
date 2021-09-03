'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./sign-up.ctrl');

// 회원가입 API
router.post('/sign-up', ctrl.process.signUp);

module.exports = router;
