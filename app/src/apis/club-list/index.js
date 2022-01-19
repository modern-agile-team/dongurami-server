'use strict';

const express = require('express');

const router = express.Router();
const apiAuth = require('../../middlewares/api-auth');
const ctrl = require('./club.ctrl');

router.get('/', apiAuth.apiAuth, ctrl.process.readClubList);

module.exports = router;
