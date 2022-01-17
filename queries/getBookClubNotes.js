const db = require("../config/db/mysql").pool;

module.exports = (bookClubId) => {
	return new Promise((resolve, reject) => {
		const query = `SELECT * FROM book_clubs_notes 
        JOIN book_clubs_global_books ON book_clubs_global_books.book_club_id = ${bookClubId}
        WHERE book_clubs_notes.book_clubs_global_books_id = book_clubs_global_books.id`;
		console.log(query);
		db.query(query, (err, notes, fields) => {
			if (err) {
				reject(err);
			}
			resolve(notes);
		});
	});
};
