'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./notification.ctrl');

router.get('/', ctrl.process.findAllById);

router.delete('/:notificationNum', ctrl.process.deleteByNotificationNum);
router.delete('/entire/:studentId', ctrl.process.deleteAllById);

module.exports = router;
