'use stirct';

const express = require('express');

const router = express.Router();
const ctrl = require('./home.ctrl');

router.get('/circle/home/:clubNum', ctrl.process.findOneByClubNum);
router.post('/circle/home/:clubNum', ctrl.process.enroll);
module.exports = router;
