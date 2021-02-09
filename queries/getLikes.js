const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (userId) => {
    return new Promise((resolve, reject) => {

        const query = `
		SELECT DISTINCT likes.*, activities.object_id, activities.user_id AS doer_id, u.full FROM likes
        JOIN users AS u ON u.id = likes.liked_by
        JOIN activities ON activities.id = likes.activity_id
        JOIN friendships ON friendships.user_id_1 = activities.user_id OR friendships.user_id_2 = activities.user_id
        JOIN users ON (friendships.user_id_1 = users.id OR friendships.user_id_2 = users.id) AND users.id <> ${userId}
        WHERE ( friendships.user_id_1 = ${userId} OR friendships.user_id_2 = ${userId} ) AND friendships.accepted = TRUE AND activities.hidden = FALSE
		`
        //keeping this old query for now
        const oldQuery = `SELECT DISTINCT likes.activity_id, likes.liked_by, users.full FROM likes
        JOIN users ON users.id = likes.liked_by
        JOIN activities ON activities.id = likes.activity_id
        JOIN friendships ON ((friendships.user_id_1 = users.id OR friendships.user_id_2 = users.id) AND (friendships.accepted = TRUE AND friendships.declined != TRUE))
        WHERE friendships.user_id_1 = ${userId} OR friendships.user_id_2 = ${userId}`

        db.query(query, (err, results, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
