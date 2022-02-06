const db = require("../config/db/mysql").pool;

module.exports = (isbn10, isbn13) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM global_books WHERE global_books.isbn10 = "${isbn10}" OR global_books.isbn13 = "${isbn13}" OR global_books.isbn13 = "${isbn10}" OR global_books.isbn10 = "${isbn13}"`;
    db.query(query, (err, books, fields) => {
      if (err) {
        reject(err);
      }

      if (!books) {
        resolve(false);
      } else {
        resolve(books[0]);
      }
    });
  });
};
