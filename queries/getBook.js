const db = require("../config/db/mysql").pool;

module.exports = (id, userId) => {
	return new Promise((resolve, reject) => {
		const query = `SELECT global_books.*, users_globalbooks.id AS users_globalbooks_id, users_globalbooks.notes AS notes, users_globalbooks.read FROM global_books LEFT JOIN users_globalbooks ON global_books.id = users_globalbooks.global_book_id AND users_globalbooks.user_id = ${userId} WHERE global_books.id = ${id};`;

		db.query(query, (err, book, fields) => {
			if (err || !book) {
				reject(err);
			} else {
				resolve(book[0]);
			}
		});
	});
};
