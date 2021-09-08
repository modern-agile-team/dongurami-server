'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./find-password.ctrl');

router.post('/find-password', ctrl.process.findPassword);

module.exports = router;
