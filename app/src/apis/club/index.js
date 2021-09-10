'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./club.ctrl');

router.get('/', ctrl.process.readClubList);

module.exports = router;
