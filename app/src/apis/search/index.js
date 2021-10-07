'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./search.ctrl');

router.get('/', ctrl.process.search);

module.exports = router;
