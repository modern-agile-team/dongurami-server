'use strict';

class BoardUtil {
  static changeAnonymous(boards) {
    boards.forEach((board) => {
      if (board.writerHiddenFlag) {
        board.studentId = '익명';
        board.studentName = '익명';
        board.profileImageUrl = null;
      }
    });
  }

  static getAddQueryForPromotion(boardInfo) {
    let category = '';
    let direction = '';

    if (boardInfo.clubCategory !== undefined) {
      category = ` AND clubs.category = '${boardInfo.clubCategory}'`;
    }
    if (boardInfo.order.toUpperCase() === 'DESC') {
      direction = ` AND bo.no < ${boardInfo.lastNum}`;
    } else if (boardInfo.order.toUpperCase() === 'ASC') {
      direction = ` AND bo.no > ${boardInfo.lastNum}`;
    }

    return { category, direction };
  }
}

module.exports = BoardUtil;
