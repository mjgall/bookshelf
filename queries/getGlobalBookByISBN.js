const db = require('../config/db/mysql').pool;

module.exports = (isbn) => {


  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM global_books WHERE global_books.isbn10 = ${isbn} OR global_books.isbn13 = ${isbn};`;

    db.query(query, (err, books, fields) => {
      if (err) {
        reject(err);
      }
      if (books?.length === 0) {
        resolve(false)
      } else {
        resolve(books[0]);
      }
      
    });
  });
};
