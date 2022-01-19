'use strict';

class CommentUtil {
  static samePersonAnonymization(anonymous, comment) {
    comment.studentId = anonymous[comment.studentId];
    comment.studentName = anonymous[comment.studentId];
    comment.profileImageUrl = null;
  }

  static newPersonAnonymization(anonymous, comment) {
    const newPerson = `익명${Object.keys(anonymous).length + 1}`;

    anonymous[comment.studentId] = newPerson;
    comment.studentId = newPerson;
    comment.studentName = newPerson;
    comment.profileImageUrl = null;
  }
}

module.exports = CommentUtil;
