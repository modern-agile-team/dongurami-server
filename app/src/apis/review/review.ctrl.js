'use strict';

const Review = require('../../models/services/Review/Review');

const process = {
  createByClubNum: (req, res) => {
    // req: 별점, 내용.
    // jwt 토큰의 id 값을 받아옴.
    // members 테이블에서 해당하는 id의 club_no와 파라미터로 받은 clubnum이 같은지 확인.
    // 같으면 후기 작성 가능.
    // 작성자는 jwt 토큰 id값.
    // 별점, 내용, 날짜가 저장되어야 함.
    const review = new Review(req);
    const response = review.createByClubNum();
    return res.status(201).json(response);
  },
};

try {
  console.log(hello);
} catch (err) {
  throw err;
} finally {
  console.log(err);
}
module.exports = {
  process,
};
