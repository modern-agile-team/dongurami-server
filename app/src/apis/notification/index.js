'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./notification.ctrl');

router.get('/:studentId', ctrl.process.findAllById);
router.get('/:notification-num', ctrl.process.updateByNotificationNum);
module.exports = router;
