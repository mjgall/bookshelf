const db = require('../config/db/mysql').pool;
const sqlString = require('sqlstring');

// module.exports = book => {
//   return new Promise((resolve, reject) => {
//     const query = `UPDATE user_books SET title = ${sqlString.escape(
//       book.title
//     )}, author = ${sqlString.escape(book.author)}, notes = ${sqlString.escape(
//       book.notes
//     )}, \`read\` = ${sqlString.escape(book.read)} WHERE id = ${book.id};`;

//     db.query(query, (err, results, fields) => {
//       if (err) {
//         throw Error(err);
//       }
//       resolve(results[0]);
//     });
//   });
// };

module.exports = (bookClubId, bookId) => {
  return new Promise((resolve, reject) => {

    const query = `UPDATE book_clubs_global_books SET global_book_id = ${bookId} WHERE book_club_id = ${bookClubId};`;
    console.log(query);
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
        throw Error(err);
      }
      db.query(
        `SELECT * FROM book_clubs_global_books WHERE id = ${bookClubId}`,
        (err, results, fields) => {
          if (err) {
            reject(err);
            throw Error(err);
          }
          resolve(results[0]);
        }
      );
    });
  });
};
