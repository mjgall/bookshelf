const db = require('../config/db/mysql').pool;

module.exports = id => {
  return new Promise((resolve, reject) => {
    const oldQuery = `SELECT * FROM user_books WHERE user_books.user_id = ${id};`;
    const query = `SELECT * FROM user_books 
    WHERE user_id 
    IN (SELECT DISTINCT user_id FROM households_users WHERE household_id 
    IN (SELECT household_id FROM households_users WHERE invite_accepted = true AND user_id = ${id})) AND invite_accepted = true OR user_id = ${id};`;

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
