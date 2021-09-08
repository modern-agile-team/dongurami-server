'use strict';

const express = require('express');

const router = express.Router();
const ctrl = require('./review.ctrl');
const loginAuth = require('../../middlewares/login-auth');
const clubAuth = require('../../middlewares/club-auth');

// 모든 후기를 보여주는 API
router.get('/:clubNum', loginAuth.loginCheck, ctrl.process.findOneByClubNum);
// 동아리 부원이 맞다면 리뷰를 작성할 수 있는 API
router.post(
  '/:clubNum',
  loginAuth.loginCheck,
  clubAuth.clubJoinCheck,
  ctrl.process.createByReview
);
// 등록된 후기 수정 API
router.put('/:clubNum/:num', loginAuth.loginCheck, ctrl.process.updateById);
// 등록된 후기 삭제 API
router.delete('/:clubNum/:num', loginAuth.loginCheck, ctrl.process.deleteByNum);

module.exports = router;
