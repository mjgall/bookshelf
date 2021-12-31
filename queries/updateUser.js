const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (userId, field, value) => {
	return new Promise((resolve, reject) => {
		const query = `UPDATE users SET ${field} = ${sqlString.escape(value)} WHERE users.id = ${userId}`;
		console.log(query)
		db.query(query, (err, results, fields) => {
			if (err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
};
