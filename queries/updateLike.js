const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (likedBy, activityId, remove) => {
	return new Promise((resolve, reject) => {
		let query;
		if (remove) {
			query = `DELETE FROM likes WHERE activity_id = ${activityId} AND liked_by = ${likedBy}`;
		} else {
			query = `INSERT INTO likes (activity_id, liked_by, timestamp) VALUES (${activityId}, ${likedBy}, '${Date.now()}')`;
		}

		db.query(query, (err, results, fields) => {
			if (err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
};
