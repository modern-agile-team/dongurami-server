'use strict';

const ReviewStorage = require('./ReviewStorage');
const Error = require('../../utils/Error');

class Review {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findOneByClubNum() {
    const clubNum = Number(this.params.clubNum);
    const user = this.auth;

    try {
      const { success, reviewList } = await ReviewStorage.findOneByClubNum(
        clubNum
      );
      if (success) {
        return { success: true, reviewList, studentId: user.id };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async createByReivew() {
    const review = this.body;
    const clubNum = Number(this.params.clubNum);
    const user = this.auth;

    try {
      const userInfo = {
        studentId: user.id,
        clubNum,
      };

      const isReview = await ReviewStorage.findOneById(userInfo);

      if (!isReview) {
        const reviewInfo = {
          clubNum,
          id: user.id,
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
      }
      return { success: false, msg: '이미 후기를 작성했습니다.' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async updateById() {
    const review = this.body;
    const ReviewNum = Number(this.params.num);

    try {
      const reviewInfo = {
        num: ReviewNum,
        description: review.description,
        score: review.score,
      };

      const isUpdate = await ReviewStorage.updateOneById(reviewInfo);

      if (isUpdate) {
        return {
          success: true,
          msg: '후기가 수정되었습니다.',
        };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async deleteByNum() {
    const reviewNum = Number(this.params.num);

    try {
      const isDelete = await ReviewStorage.deleteOneByNum(reviewNum);

      if (isDelete) {
        return { success: true, msg: '작성된 후기가 삭제되었습니다.' };
      }
      return {
        success: false,
        msg: '후기를 삭제하지 못했습니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = Review;
