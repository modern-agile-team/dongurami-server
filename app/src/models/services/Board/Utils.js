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

  static samePersonAnonymization(anonymous, comment) {
    comment.studentName = anonymous[comment.studentId];
    comment.studentId = anonymous[comment.studentId];
    comment.profileImageUrl = null;
  }

  static newPersonAnonymization(anonymous, comment) {
    const newPerson = `익명${Object.keys(anonymous).length + 1}`;

    anonymous[comment.studentId] = newPerson;
    comment.studentId = newPerson;
    comment.studentName = newPerson;
    comment.profileImageUrl = null;
  }

  static getAddQueryForPromotion(boardInfo) {
    let category = '';
    let direction = '';

    if (boardInfo.clubCategory !== undefined) {
      category = ` AND clubs.category = '${boardInfo.clubCategory}'`;
    }
    if (boardInfo.order.toUpperCase() === 'DESC') {
      if (Number(boardInfo.lastNum) !== 0) {
        direction = ` AND bo.no < ${boardInfo.lastNum}`;
      }
    } else if (boardInfo.order.toUpperCase() === 'ASC') {
      direction = ` AND bo.no > ${boardInfo.lastNum}`;
    }

    return { category, direction };
  }
}

module.exports = BoardUtil;
