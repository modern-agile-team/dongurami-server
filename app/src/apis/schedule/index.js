'use stirct';

const express = require('express');

const router = express.Router();
const ctrl = require('./schedule.ctrl');

router.get('/:clubNum', ctrl.process.findAllByClubNum);
router.post('/:clubNum', ctrl.process.createSchedule);
router.put('/:clubNum', ctrl.process.updateSchedule);
router.put('/:clubNum/:no', ctrl.process.updateImportant);
router.delete('');
module.exports = router;
