'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./search.ctrl');

router.get('/:category', ctrl.process.search);

module.exports = router;
