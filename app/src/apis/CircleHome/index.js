'use stirct';

const express = require('express');

const router = express.Router();
const ctrl = require('./home.ctrl');

router.get('/home/:clubNum', ctrl.process.findOneByClubNum);
router.put('/home/:clubNum', ctrl.process.enroll);
module.exports = router;
