const db = require("../config/db/mysql").pool;

module.exports = (userId = 1, book) => {
	return new Promise((resolve, reject) => {
		const query = `      
SELECT friendships.id AS relationship_id, (CASE friendships.user_id_1 WHEN ${userId} THEN friendships.user_id_2 ELSE friendships.user_id_1 END) as user_id, users.email, users.full, users.picture, "friend" AS type
FROM friendships 
JOIN users 
	ON (friendships.user_id_1 = users.id OR friendships.user_id_2 = users.id) AND users.id <> ${userId}
JOIN user_books
	ON users.id = user_books.user_id AND user_books.global_id = ${book}
WHERE ( friendships.user_id_1  = ${userId} OR friendships.user_id_2  = ${userId} ) AND friendships.accepted = TRUE AND friendships.declined != TRUE`;
		db.query(query, (err, results, fields) => {
			if (err || !results) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
};




