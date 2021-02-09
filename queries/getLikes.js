const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT DISTINCT likes.activity_id, likes.liked_by, users.full FROM likes
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
