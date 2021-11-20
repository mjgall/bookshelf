const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (book) => {

	const { userId, title, author, isbn, isbn13, image } = book;

	return new Promise((resolve, reject) => {
		const query = `
        INSERT INTO global_books (title, author, isbn10, isbn13, cover) VALUES (${sqlString.escape(
			title
		)}, ${sqlString.escape(author)}, ${sqlString.escape(
			isbn
		)}, ${sqlString.escape(isbn13)}, ${sqlString.escape(image)});
        `;
		
		db.query(query, (err, results, fields) => {
			if (err) {
				reject(err);
			} else {
				db.query(
					`SELECT * FROM global_books WHERE id = ${results.insertId}`,
					(err, results, fields) => {
						if (err) {
							reject(err);
						} else {
							resolve(results[0]);
						}
					}
				);
			}
		});
	});
};
