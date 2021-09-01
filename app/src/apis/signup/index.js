'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./signup.ctrl');

router.post('/signup', ctrl.process.signup);

module.exports = router;
