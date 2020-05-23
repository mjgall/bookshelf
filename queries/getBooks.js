const db = require('../config/db/mysql').pool;

module.exports = id => {
  return new Promise((resolve, reject) => {
    const oldQuery = `SELECT user_books.author, user_books.cover, user_books.title, user_books.global_id, user_books.id, users.full FROM user_books JOIN users ON users.id = user_books.user_id WHERE user_books.user_id = ${id} AND private != true;`;
    
    const query = `SELECT * FROM user_books 
    WHERE user_id 
    IN (SELECT DISTINCT user_id FROM households_users WHERE invite_accepted = true AND household_id 
    IN (SELECT household_id FROM households_users WHERE user_id = ${id})) OR user_id = ${id};`;

    db.query(
      oldQuery,
      (err, books, fields) => {
        if (err) {
          reject(err);
        }

        resolve(books);
      }
    );
  });
};
