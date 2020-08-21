const db = require('../config/db/mysql').pool;

module.exports = (globalBookId, userId) => {
  return new Promise((resolve, reject) => {
    // const query = `SELECT households_books.*, households.name AS household_name FROM households_books JOIN households ON households_books.household_id = households.id WHERE global_book_id = ${globalBookId} AND user_id = ${userId}`;

    const query = `
    SELECT
    households_books.id,
    global_books.id AS global_book_id,
    households.id AS household_id,
    households.name AS household_name,
    households_books.notes
    FROM global_books
    JOIN user_books ON user_books.global_id = global_books.id
    JOIN households_users AS hu ON hu.user_id = user_books.user_id
    JOIN households_users ON households_users.household_id = hu.household_id
    JOIN households ON households_users.household_id = households.id
    LEFT JOIN households_books ON global_books.id = households_books.global_book_id
    AND households_books.household_id = hu.household_id
    WHERE households_users.user_id = ${userId}
    AND global_books.id = ${globalBookId}
    AND households_users.invite_accepted = true
    `
    
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
        throw Error(err);
      }
      resolve(results);
    });
  });
};
