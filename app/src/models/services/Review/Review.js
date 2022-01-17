'use strict';

const ReviewStorage = require('./ReviewStorage');
const Error = require('../../utils/Error');
const WriterCheck = require('../../utils/WriterCheck');

class Review {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findOneByClubNum() {
    const user = this.auth;

    try {
      const { success, reviewList } = await ReviewStorage.findReviewByClubNum(
        this.params.clubNum
      );

      if (success) {
        return {
          success: true,
          msg: '동아리 후기 조회 성공',
          reviewList,
          studentId: user.id,
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

  async createByReviewInfo() {
    const { clubNum } = this.params;
    const user = this.auth;

    try {
      const userInfo = {
        clubNum,
        studentId: user.id,
      };

      const isReview = await ReviewStorage.findOneById(userInfo);

      if (!isReview) {
        return await this.saveReview();
      }
      return { success: false, msg: '이미 후기를 작성했습니다.' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async saveReview() {
    const review = this.body;

    const reviewInfo = {
      clubNum: this.params.clubNum,
      id: this.auth.id,
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

  async updateById() {
    const review = this.body;
    const reviewNum = this.params.num;
    const user = this.auth;

    try {
      const reviewInfo = {
        num: reviewNum,
        description: review.description,
        score: review.score,
      };

      const isWriterCheck = await WriterCheck.ctrl(
        user.id,
        reviewInfo.num,
        'reviews'
      );

      if (!isWriterCheck.success) return isWriterCheck;

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
    const reviewNum = this.params.num;
    const user = this.auth;

    try {
      const isWriterCheck = await WriterCheck.ctrl(
        user.id,
        reviewNum,
        'reviews'
      );

      if (!isWriterCheck.success) return isWriterCheck;

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
