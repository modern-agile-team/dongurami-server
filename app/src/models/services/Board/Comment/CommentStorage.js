// 'use strict';

// const mariadb = require('../../../../config/mariadb');

// class CommentStorage {
//   static async findAllByBoardNum(boardNum) {
//     let conn;

//     try {
//       conn = await mariadb.getConnection();

//       const query = `;`;

//       const comments = await conn.query(query);

//       return comments;
//     } catch (err) {
//       console.log(err);
//       throw err;
//     } finally {
//       conn?.release();
//     }
//   }
// }
