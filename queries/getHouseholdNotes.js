const db = require('../config/db/mysql').pool;

module.exports = (globalBookId, userId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT households_books.*, households.name AS household_name FROM households_books JOIN households ON households_books.household_id = households.id WHERE global_book_id = ${globalBookId} AND user_id = ${userId}`;
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
        throw Error(err);
      }
      resolve(results);
    });
  });
};
