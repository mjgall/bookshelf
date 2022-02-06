const db = require("../config/db/mysql").pool;

module.exports = (globalBookId, userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE user_books, households_books FROM user_books 
      LEFT JOIN households_books ON households_books.global_book_id = user_books.global_id AND households_books.user_id = user_books.user_id
      JOIN global_books ON user_books.global_id = global_books.id 
      WHERE global_books.id = ${globalBookId} AND user_books.user_id = ${userId}
      `;

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results);
    });
  });
};
