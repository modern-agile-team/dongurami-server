'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./notification.ctrl');

router.get('/:studentId', ctrl.process.findAllById);

router.delete('/:notification-num', ctrl.process.deleteByNotificationNum);
router.delete('/entire-notification', ctrl.process.deleteAllById);

module.exports = router;
