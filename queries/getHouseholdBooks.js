const db = require('../config/db/mysql').pool;


module.exports = (userId) => {

  // const query = `SELECT global_books.* FROM global_books INNER JOIN global_books ON global_books.id = user_books.global_id WHERE user_books.user_id = ${acceptedUserId}`

  return new Promise((resolve, reject) => {

    const query = `
    SELECT 
	  global_books.*,
    users_globalbooks.read,
    users_globalbooks.notes,
    users_globalbooks.id AS users_globalbooks_id,
    households.name AS household_name,
    households.id AS household_id,
    user_books.user_id,
    households_books.id AS households_books_id
    FROM global_books
  	LEFT JOIN users_globalbooks ON users_globalbooks.global_book_id = global_books.id
    JOIN user_books ON user_books.global_id = global_books.id
    JOIN households_users AS hu ON hu.user_id = user_books.user_id
    JOIN households_users ON households_users.household_id = hu.household_id AND households_users.invite_accepted = TRUE
    JOIN households ON households.id = hu.household_id
    LEFT JOIN households_books ON global_books.id = households_books.global_book_id AND households.id = households_books.household_id
    WHERE households_users.user_id = ${userId} AND hu.user_id != ${userId}
    ORDER BY global_books.id DESC
    `
    db.query(query, (err, results, fields) => {
      if (err) {
        throw new Error(err);
      } else {
        resolve(results);
      }
    });
  });
};
