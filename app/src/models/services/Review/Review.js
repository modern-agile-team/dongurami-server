'use strict';

const ReviewStorage = require('./ReviewStorage');
const Error = require('../../utils/Error');
const WriterCheck = require('../../utils/WriterCheck');
const makeResponse = require('../../utils/makeResponse');

class Review {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findOneByClubNum() {
    try {
      const reviewList = await ReviewStorage.findReviewByClubNum(
        this.params.clubNum
      );
      return makeResponse(200, '동아리 후기 조회 성공', {
        reviewList,
        studentId: this.auth.id,
      });
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async createByReviewInfo() {
    const userInfo = {
      clubNum: this.params.clubNum,
      studentId: this.auth.id,
    };

    try {
      const isReview = await ReviewStorage.findOneById(userInfo);

      if (!isReview) return await this.saveReview();
      return makeResponse(400, '이미 후기를 작성했습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async saveReview() {
    const reviewInfo = {
      clubNum: this.params.clubNum,
      id: this.auth.id,
      description: this.body.description,
      score: this.body.score,
    };

    const isReview = await ReviewStorage.saveReview(reviewInfo);

    if (isReview) return makeResponse(201, '후기 작성이 완료되었습니다.');
    return makeResponse(
      400,
      '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.'
    );
  }

  async updateById() {
    try {
      const isWriterCheck = await WriterCheck.ctrl(
        this.auth.id,
        this.params.num,
        'reviews'
      );

      if (!isWriterCheck.success) return isWriterCheck;
      return await this.updateReview();
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateReview() {
    const reviewInfo = {
      num: this.params.num,
      description: this.body.description,
      score: this.body.score,
    };

    const isUpdate = await ReviewStorage.updateOneById(reviewInfo);

    if (isUpdate) return makeResponse(200, '후기가 수정되었습니다.');
    return makeResponse(
      400,
      '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.'
    );
  }

  async deleteByNum() {
    try {
      const isWriterCheck = await WriterCheck.ctrl(
        this.auth.id,
        this.params.num,
        'reviews'
      );

      if (!isWriterCheck.success) return isWriterCheck;
      return await this.deleteReview();
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async deleteReview() {
    const isDelete = await ReviewStorage.deleteOneByNum(this.params.num);

    if (isDelete) return makeResponse(200, '작성된 후기가 삭제되었습니다.');
    return makeResponse(
      400,
      '후기를 삭제하지 못했습니다. 서버 개발자에게 문의해주세요.'
    );
  }
}

module.exports = Review;
