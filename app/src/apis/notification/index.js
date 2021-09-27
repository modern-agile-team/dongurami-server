'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./notification.ctrl');

router.get('/:studentId', ctrl.process.findAllById);

router.delete('/:notification-num', ctrl.process.deleteByNotificationNum);
module.exports = router;
