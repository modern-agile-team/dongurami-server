'use strict';

const express = require('express');

const ctrl = require('./s3.ctrl');
const apiAuth = require('../../middlewares/api-auth');

const router = express.Router();

router.post('/pre-signed-url', apiAuth.apiAuth, ctrl.process.createPutUrl);

module.exports = router;
