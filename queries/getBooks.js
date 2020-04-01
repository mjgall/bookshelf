const db = require('../config/db/mysql').pool;

module.exports = id => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM user_books WHERE user_books.user_id = ${id} OR user_books.user_id = (SELECT households.user_id_2 FROM households WHERE households.user_id_1 = ${id});`,
      (err, books, fields) => {
        if (err) {
          reject(err);
        }

        resolve(books);
      }
    );
  });
};
