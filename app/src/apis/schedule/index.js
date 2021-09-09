'use stirct';

const express = require('express');

const router = express.Router();
const ctrl = require('./schedule.ctrl');

router.post('/:clubNum', ctrl.process.createSchedule);

router.get('/:clubNum', ctrl.process.findAllByClubNum);
router.get('/:clubNum/:date', ctrl.process.findAllByDate);

router.put('/:clubNum/:no', ctrl.process.updateSchedule);
router.patch('/:clubNum/:no', ctrl.process.updateImportant);

router.delete('/:clubNum/:no', ctrl.process.deleteSchedule);

module.exports = router;
