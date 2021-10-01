'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./my-page.ctrl');
// const loginAuth = require('../../middlewares/login-auth');

router.get('/:id/scraps', ctrl.process.findAllScraps);

module.exports = router;
