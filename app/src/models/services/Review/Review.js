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
    const paramsClubNum = Number(this.params.clubNum);
    const payload = Auth.verifyToken(this.token);

    if (payload.clubNum.includes(paramsClubNum)) {
      const userInfo = {
        studentId: payload.id,
        clubNum: paramsClubNum,
      };
      const isReview = await ReviewStorage.findReview(userInfo);

      if (isReview) {
        try {
          const reviewInfo = {
            clubNum: paramsClubNum,
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
            msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
          };
        } catch (err) {
          return { success: false, msg: 'DB에러 발생', err };
        }
      }
      return { success: false, msg: '이미 후기를 작성했습니다.' };
    }
    return { success: false, msg: '해당 동아리에 권한이 없습니다.' };
  }

  async findByClubNum() {
    const paramsClubNum = this.params.clubNum;
    try {
      const { success, reviewList } = await ReviewStorage.findAllReview(
        paramsClubNum
      );

      if (success) {
        return { success: true, reviewList };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요',
      };
    } catch (err) {
      return { success: false, msg: 'DB에러 발생', err };
    }
  }
}

module.exports = Review;
