'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./review.ctrl');

// payload(JWT)와 params의 clubNum이 일치하는지 확인.
router.post('/', ctrl.process.createToken);
// 동아리 부원이 맞다면 리뷰를 작성할 수 있는 API
router.post('/:clubNum', ctrl.process.createByReview);
// 모든 후기를 보여주는 API
router.get('/:clubNum', ctrl.process.findOneByClubNum);
// 등록된 후기 수정 API
router.put('/:clubNum/:num', ctrl.process.updateById);
// 등록된 후기 삭제 API
router.delete('/:clubNum/:num', ctrl.process.deleteByNum);

module.exports = router;
