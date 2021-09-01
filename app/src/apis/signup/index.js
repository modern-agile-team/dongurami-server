'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./signup.ctrl');

// router.get('/list', ctrl.output.list);

// router.post('/login', ctrl.process.login);
router.post('/signup', ctrl.process.signup);

module.exports = router;
