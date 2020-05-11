const db = require('../config/db/mysql').pool;


module.exports = (userId) => {

  return new Promise((resolve, reject) => {
    const query = `SELECT users_globalbooks.read, users_globalbooks.notes AS personalNotes, users_globalbooks.id AS users_globalbooks_id, global_books.*, households_books.notes as household_notes, households_books.user_id, households_books.household_id, households_books.id AS households_book_id, households.name AS household_name FROM households_users JOIN households_books ON households_books.household_id = households_users.household_id JOIN global_books ON global_books.id = households_books.global_book_id JOIN households on households.id = households_books.household_id LEFT JOIN users_globalbooks ON users_globalbooks.global_book_id = global_books.id AND users_globalbooks.user_id = ${userId} WHERE households_users.user_id = ${userId} AND households_books.user_id != ${userId} ORDER BY global_books.id DESC`;
    db.query(query, (err, results, fields) => {
      if (err) {
        throw new Error(err);
      } else {
        resolve(results);
      }
    });
  });
};
