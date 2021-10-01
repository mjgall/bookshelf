const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (userId) => {
	return new Promise((resolve, reject) => {
		// const query = `SELECT * FROM loans WHERE lender_id = ${userId} or borrower_id = ${userId}`
		const query = `SELECT users.full, user_books.id AS user_books_id, loans.id, loans.global_id, loans.lender_id, loans.borrower_id, loans.start_date, loans.end_date, 
        global_books.title, global_books.cover, 
        users.id AS user_id, users.full AS user_name, users.picture AS user_picture 
		FROM loans
        JOIN global_books ON global_books.id = loans.global_id
        JOIN users ON (loans.lender_id = users.id OR loans.borrower_id = users.id)
		JOIN user_books ON global_books.id = user_books.global_id
        WHERE (loans.lender_id = ${userId} OR loans.borrower_id = ${userId}) AND users.id != ${userId} AND loans.canceled = 0
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
