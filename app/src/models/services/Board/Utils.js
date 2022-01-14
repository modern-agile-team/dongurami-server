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
}

module.exports = BoardUtil;
