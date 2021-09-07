'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./find-id.ctrl');

// 아이디(학번) 찾기 API
router.post('/find-id', ctrl.process.findId);

module.exports = router;
