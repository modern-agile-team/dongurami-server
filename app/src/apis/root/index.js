'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./root.ctrl');
const auth = require('../../middlewares/login-auth');

router.get('/login-check', auth.isLogined, ctrl.process.loginCheck);
router.post('/login', ctrl.process.login);
router.post('/sign-up', ctrl.process.signUp);

module.exports = router;
