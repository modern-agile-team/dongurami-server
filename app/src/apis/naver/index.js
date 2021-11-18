'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./naver.ctrl');
const snsTokenAuth = require('../../middlewares/snsToken-auth');

router.get('/login', snsTokenAuth.snsTokenCheck, ctrl.process.login);
router.post('/sign-up', ctrl.process.signUp);

module.exports = router;
