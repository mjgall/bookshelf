const db = require("../config/db/mysql").pool;

module.exports = (id) => {
	return new Promise((resolve, reject) => {
		const query = `SELECT book_clubs_global_books.id AS book_clubs_global_books_id, book_clubs.name, book_clubs.id AS book_club_id, book_clubs.create_date AS book_club_create_date, global_books.id AS global_book_id, global_books.title, global_books.author, global_books.cover FROM book_clubs
		LEFT JOIN book_clubs_global_books ON book_clubs.id = book_clubs_global_books.book_club_id
		LEFT JOIN global_books ON book_clubs_global_books.global_book_id = global_books.id
		WHERE book_clubs.id = ${id}
        ORDER BY book_clubs_global_books.id DESC LIMIT 0, 1;`;
		db.query(query, (err, clubs, fields) => {
			if (err) {
				reject(err);
			}
			resolve(clubs[0]);
		});
	});
};
