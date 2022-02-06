const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (sharedShelfId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT user_books.user_id, user_books.author, user_books.cover, user_books.title, user_books.global_id, user_books.id, users.full FROM user_books
    JOIN users ON users.id = user_books.user_id 
    WHERE users.shelf_id = ? AND user_books.private != true AND users.shelf_enabled = TRUE;`;

    db.query(query, [sharedShelfId], (err, books, fields) => {
      if (err) {
        reject(err);
      }

      resolve(books);
    });
  });
};
