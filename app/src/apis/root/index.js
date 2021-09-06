'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./root.ctrl');
const auth = require('../../middlewares/auth-check');

router.get('/auth', auth.loggined, ctrl.authResponse);
router.get('/un-auth', auth.notLoggined, ctrl.unAuthResponse);

modules.exports = router;
