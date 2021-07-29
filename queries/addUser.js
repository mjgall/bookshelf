const db = require("../config/db/mysql").pool;
const randomId = require("../services/randomId")
const bcrypt = require('bcryptjs');
const sqlString = require("sqlstring");



module.exports = (user) => {
	const { googleId, first, firstName, last, lastName, email, picture, full, password } = user;
	console.log(user)
	const randomShelfId = randomId()

	// const query = `INSERT INTO users (googleId, first, last, full, email, picture, create_date, shelf_id) VALUES ('${googleId}', '${first}', '${last}', '${full}', '${email}', '${picture}', NOW(), ${randomShelfId});`;
	let query
	if (!password) {
		query = `INSERT INTO users (googleId, first, last, full, email, picture, create_date, shelf_id) VALUES ('${googleId}', '${first}', '${last}', '${full}', '${email}', '${picture}', NOW(), '${randomShelfId}');`;
	} else {
		query = `INSERT INTO users (password, first, last, full, email, create_date, shelf_id) VALUES (${sqlString.escape(bcrypt.hashSync(password, 10))}, '${firstName}', '${lastName}', '${firstName} ${lastName}', '${email}', NOW(), '${randomShelfId}');`;
	}
	console.log(query);
	return new Promise((resolve, reject) => {
		db.query(query, (err, results, fields) => {
			if (err) {
				reject(err);
			} else {
				db.getConnection((err, connection) => {
					connection.query(
						`SELECT * FROM users WHERE id = ${results.insertId}`,
						(err, users, fields) => {
							if (err) {
								reject(err);
							}
							resolve(users[0]);
						}
					);
				});
			}
		});
	});
};
