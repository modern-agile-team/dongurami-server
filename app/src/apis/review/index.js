'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./review.ctrl');

// 해당 동아리에 가입되었는지 확인하는 API
router.post('/home/review', ctrl.process.createToken);
// 동아리 부원이 맞다면 리뷰를 작성할 수 있는 API
router.post('/home/review/:clubNum', ctrl.process.createByClubNum);

// 후기 불러오기.

module.exports = router;
