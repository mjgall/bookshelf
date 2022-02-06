const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (bookClubId, bookId) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO book_clubs_global_books (global_book_id, book_club_id, create_date) VALUES (${bookId}, ${bookClubId}, NOW());`;
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
        throw Error(err);
      }
      db.query(
        `SELECT * FROM book_clubs_global_books WHERE id = ${results.insertId}`,
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
