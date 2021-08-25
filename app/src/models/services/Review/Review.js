'use strict';

const ReviewStorage = require('./ReviewStorage');

class Review {
  constructor(body) {
    this.body = body;
    this.params = params;
  }

  createByClubNum() {
    const review = this.body;
    const paramsClubNum = this.params.clubNum;
    try {
      // 토큰에 있는 id값을 가져와야 함.
      const clubNum = ReviewStorage.getClubNum(review.id);
      console.log(clubNum);
      if (paramsClubNum === undefined)
        return { success: false, msg: '요청하신 경로가 잘못되었습니다.' };

      if (clubNum === paramsClubNum) {
        const response = ReviewStorage.saveReview(review);
        return response;
      }
      return { success: false, msg: '해당 동아리 권한이 없습니다.' };
    } catch (error) {
      return { success: false, msg: err.sqlMessage };
    }
  }
}

module.exports = Review;
