'use strict';

const ReviewStorage = require('./ReviewStorage');
const Error = require('../../utils/Error');

class Review {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async createByReivew() {
    const review = this.body;
    const paramsClubNum = Number(this.params.clubNum);
    const payload = this.auth;
    const userInfo = {
      studentId: payload.id,
      clubNum: paramsClubNum,
    };

    const isReview = await ReviewStorage.findAllById(userInfo);

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
        return Error.ctrl(
          '서버 에러입니다. 서버 개발자에게 문의해주세요.',
          err
        );
      }
    }
    return { success: false, msg: '이미 후기를 작성했습니다.' };
  }

  async findOneByClubNum() {
    const paramsClubNum = Number(this.params.clubNum);
    const payload = this.auth;
    const { id } = payload;

    try {
      const { success, reviewList } = await ReviewStorage.findOneByClubNum(
        paramsClubNum
      );
      if (success) {
        return { success: true, reviewList, studentId: id };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async updateById() {
    const review = this.body;
    const paramsNum = Number(this.params.num);

    const reviewInfo = {
      num: paramsNum,
      description: review.description,
      score: review.score,
    };

    try {
      const response = await ReviewStorage.updateById(reviewInfo);

      if (response) {
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
    const paramsNum = Number(this.params.num);

    try {
      const response = await ReviewStorage.deleteByNum(paramsNum);

      if (response) {
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
