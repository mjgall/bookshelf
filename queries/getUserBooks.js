const db = require('../config/db/mysql').pool;

module.exports = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT id as user_book_id, user_id, global_id as id, title, author, isbn10, isbn13, cover, language, title_long, edition, pages, date_published, date_created, notes AS user_notes, \`read\` FROM user_books WHERE user_id = ${userId}`;

    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
        throw new Error(err);
      } else {
        resolve(results);
      }
    });
  });
};
