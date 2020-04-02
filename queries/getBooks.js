const db = require('../config/db/mysql').pool;

module.exports = id => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM user_books WHERE user_books.user_id = ${id};`,
      (err, books, fields) => {
        if (err) {
          reject(err);
        }

        resolve(books);
      }
    );
  });
};
