const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (bookId, lenderId, borrowerId, startDate) => {
	return new Promise((resolve, reject) => {
		const query = `INSERT INTO loans (global_id, lender_id, borrower_id, start_date) VALUES (${bookId}, ${lenderId}, ${borrowerId}, '${startDate}')`;
		db.query(query, (err, results, fields) => {
			if (err) {
				reject(err);
			} else {
				const query = `UPDATE bookshelf.user_books SET on_loan = TRUE WHERE user_id = ${lenderId} and global_id = ${bookId};`;
				db.query(query, (err, results, fields) => {
					if (err) {
						reject(err);
					} else {
						resolve(results);
					}
				});
			}
		});
	});
};
