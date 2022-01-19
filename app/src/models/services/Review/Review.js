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
    const userInfo = {
      clubNum: this.params.clubNum,
      studentId: this.auth.id,
    };

    try {
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
    const reviewInfo = {
      clubNum: this.params.clubNum,
      id: this.auth.id,
      description: this.body.description,
      score: this.body.score,
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
    const reviewNum = this.params.num;
    const reviewInfo = {
      num: reviewNum,
      description: this.body.description,
      score: this.body.score,
    };

    try {
      const isWriterCheck = await WriterCheck.ctrl(
        this.auth.id,
        reviewNum,
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
      return await this.deleteReview();
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async deleteReview() {
    const reviewNum = this.params.num;

    const isDelete = await ReviewStorage.deleteOneByNum(reviewNum);

    if (isDelete) {
      return { success: true, msg: '작성된 후기가 삭제되었습니다.' };
    }
    return {
      success: false,
      msg: '후기를 삭제하지 못했습니다. 서버 개발자에게 문의해주세요.',
    };
  }
}

module.exports = Review;
