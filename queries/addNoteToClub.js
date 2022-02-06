const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (userId, bookId, clubId, bookClubsGlobalBooksId, note) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO book_clubs_notes (user_id, book_clubs_global_books_id, note, create_date) VALUES (${userId}, ${bookClubsGlobalBooksId}, ${sqlString.escape(
      note
    )}, NOW())`;

    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
