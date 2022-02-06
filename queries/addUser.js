const db = require("../config/db/mysql").pool;
const randomId = require("../services/randomId");
const bcrypt = require("bcryptjs");
const sqlString = require("sqlstring");

module.exports = (user) => {
	const {
		googleId,
		first,
		firstName,
		last,
		lastName,
		email,
		picture,
		full,
		password,
	} = user;
	const randomShelfId = randomId();

	// const query = `INSERT INTO users (googleId, first, last, full, email, picture, create_date, shelf_id) VALUES ('${googleId}', '${first}', '${last}', '${full}', '${email}', '${picture}', NOW(), ${randomShelfId});`;
	let query;
	if (!password) {
		query = `INSERT INTO users (googleId, first, last, full, email, picture, create_date, shelf_id, last_login) VALUES ('${googleId}', '${first}', '${last}', '${full}', '${email}', '${picture}', NOW(), '${randomShelfId}', NOW());`;
	} else {
		query = `INSERT INTO users (password, first, last, full, email, create_date, shelf_id, picture, last_login) VALUES (${sqlString.escape(
			bcrypt.hashSync(password, 10)
		)}, '${firstName}', '${lastName}', '${firstName} ${lastName}', '${email}', NOW(), '${randomShelfId}', 'https://papyr-io.s3.amazonaws.com/5e8469cf-09bc-4a84-bf7d-787c7c0bfca3.png', NOW());`;
	}
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
