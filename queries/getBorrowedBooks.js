const db = require("../config/db/mysql").pool;

module.exports = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT 
    global_books.author,
    global_books.cover,
    global_books.title,
    global_books.id,
    loans.id AS loan_id
FROM
    global_books
        JOIN
    loans ON loans.global_id = global_books.id
WHERE
    loans.borrower_id = ${userId}
    AND (loans.end_date IS NULL OR loans.end_date = '');`;

    db.query(query, (err, books, fields) => {
      if (err) {
        reject(err);
      }

      resolve(books);
    });
  });
};
