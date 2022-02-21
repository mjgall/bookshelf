const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (userId) => {
  return new Promise((resolve, reject) => {
    // const query = `SELECT * FROM loans WHERE lender_id = ${userId} or borrower_id = ${userId}`
    const query = `SELECT interacted_users.full, user_books.id AS user_books_id, loans.id, loans.global_id, loans.lender_id, loans.borrower_id, loans.start_date, loans.end_date, 
    global_books.title, global_books.cover, 
    interacted_users.id AS user_id, interacted_users.full AS user_name, interacted_users.picture AS user_picture, loans.manual_name
FROM loans
    JOIN global_books ON global_books.id = loans.global_id
    JOIN users AS interacted_users ON (loans.lender_id = interacted_users.id OR loans.borrower_id = interacted_users.id)
JOIN user_books ON global_books.id = user_books.global_id
    WHERE (loans.lender_id = ${userId} OR loans.borrower_id = ${userId}) AND interacted_users.id != ${userId} AND loans.canceled = 0 AND loans.hidden = 0 OR loans.manual_name IS NOT NULL
ORDER BY loans.start_date DESC;
        `;
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
