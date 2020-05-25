const db = require('../config/db/mysql').pool;

module.exports = (userBookId) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE user_books, households_books FROM user_books 
      JOIN households_books 
      ON households_books.global_book_id = user_books.global_id
      AND households_books.user_id = user_books.user_id
      WHERE user_books.id = ${userBookId}
      `;

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results);
    });


  });

  
};
