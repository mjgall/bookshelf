const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (action, loan_id, user_books_id) => {
	return new Promise((resolve, reject) => {
		let query;
		if (action === "end") {
			query = `UPDATE loans, user_books SET loans.end_date = '${Date.now()}', user_books.on_loan = FALSE, user_books.borrower_id = NULL WHERE loans.id = ${loan_id} AND user_books.id = ${user_books_id}`;
		} 
        // else {
		// 	query = `INSERT INTO likes (activity_id, liked_by, timestamp) VALUES (${activityId}, ${likedBy}, '${Date.now()}')`;
		// }

		db.query(query, (err, results, fields) => {
			if (err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
};
