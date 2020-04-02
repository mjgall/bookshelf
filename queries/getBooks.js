const db = require('../config/db/mysql').pool;

module.exports = id => {
  return new Promise((resolve, reject) => {
    const oldQuery = `SELECT * FROM user_books WHERE user_books.user_id = ${id};`;

    const query = `SELECT COUNT(*) FROM user_books 
    WHERE user_id 
    IN (SELECT DISTINCT user_id FROM households_users WHERE invite_accepted = true AND household_id 
    IN (SELECT household_id FROM households_users WHERE user_id = ${id})) OR user_id = ${id};`;

    db.query(
      query,
      (err, books, fields) => {
        if (err) {
          reject(err);
        }

        resolve(books);
      }
    );
  });
};
