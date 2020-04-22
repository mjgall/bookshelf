const db = require('../config/db/mysql').pool;

module.exports = (userId) => {

  return new Promise((resolve, reject) => {
    const query = `SELECT global_books.*, households_books.notes as household_notes, households_books.user_id, households_books.household_id FROM households_users JOIN households_books ON households_books.household_id = households_users.household_id JOIN global_books ON global_books.id = households_books.global_book_id WHERE households_users.user_id = ${userId} AND households_books.user_id != ${userId}`;

    console.log(query)

    db.query(query, (err, results, fields) => {
      if (err) {
        throw new Error(err);
      } else {
        resolve(results);
      }
    });
  });
};
