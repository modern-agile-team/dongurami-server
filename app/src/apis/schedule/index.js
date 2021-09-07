'use stirct';

const express = require('express');

const router = express.Router();
const ctrl = require('./schedule.ctrl');

router.get('/schedule/:clubNum', ctrl.process.findAllByClubNum);
router.post('/schedule/:clubNum', ctrl.process.createSchedule);
router.put('/schedule/:clubNum', ctrl.process.updateSchedule);
module.exports = router;
