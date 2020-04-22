const db = require('../config/db/mysql').pool;

module.exports = (acceptedUserId, acceptedHouseholdId) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO households_books (global_book_id, household_id, user_id) (SELECT global_books.id, ${acceptedHouseholdId}, ${acceptedUserId} FROM user_books INNER JOIN global_books ON global_books.id = user_books.global_id WHERE user_id = ${acceptedUserId})`;

    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
        throw new Error(err);
      } else {
        resolve({ success: true, acceptedUserId, acceptedHouseholdId });
      }
    });
  });
};
