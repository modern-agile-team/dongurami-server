'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./reset-password.ctrl');

router.post('/reset-password', ctrl.process.resetPassword);

module.exports = router;
