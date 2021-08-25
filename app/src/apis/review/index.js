'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./review.ctrl');

// 후기 작성.
router.post('/home/review/:clubNum', ctrl.process.createByClubNum);

// 후기 불러오기.
