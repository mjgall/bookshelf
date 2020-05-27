const db = require('../config/db/mysql').pool;

module.exports = (globalBookId, ownerId, userId) => {
  return new Promise((resolve, reject) => {
    // const query = `SELECT households_books.*, households.name AS household_name FROM households_books JOIN households ON households_books.household_id = households.id WHERE global_book_id = ${globalBookId} AND user_id = ${userId}`;

    const query = `SELECT households_books.*, households.name AS household_name 
    FROM households_books 
    JOIN households ON households_books.household_id = households.id
    JOIN households_users ON households_users.household_id = households_books.household_id
    WHERE global_book_id = ${globalBookId} AND households_books.user_id = ${ownerId} 
    AND households_users.user_id = ${userId}
    AND households_users.invite_accepted = true`
    
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
        throw Error(err);
      }
      resolve(results);
    });
  });
};
