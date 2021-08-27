'use strict';

const ReviewStorage = require('./ReviewStorage');
const Auth = require('../Auth/Auth');

class Review {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.token = req.headers.token;
  }

  async createByClubNum() {
    const review = this.body;
    const paramsClubNum = this.params.clubNum;
    const payload = Auth.verifyToken(this.token);

    if (payload.clubNum === paramsClubNum) {
      try {
        const reviewInfo = {
          clubNum: payload.clubNum,
          id: payload.id,
          description: review.description,
          score: review.score,
        };
        const success = await ReviewStorage.saveReview(reviewInfo);

        if (success) {
          return { success: true, msg: '후기 작성이 완료되었습니다.' };
        }
        return {
          success: false,
          msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요',
        };
      } catch (err) {
        // 에러 발생에 대한 API를 따로 만들어 줘야 함.
        return { success: false, msg: 'DB에러 발생' };
      }
    } else {
      return { success: false, msg: '해당 동아리에 권한이 없습니다.' };
    }
  }
}

module.exports = Review;
