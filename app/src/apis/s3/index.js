'use strict';

const express = require('express');

const ctrl = require('./s3.ctrl');

const router = express.Router();

router.post('/pre-signed-url', ctrl.process.createPutUrl);

module.exports = router;
