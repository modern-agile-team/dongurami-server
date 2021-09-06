'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./login.ctrl');

router.post('/login', ctrl.process.login);

module.exports = router;
