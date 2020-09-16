const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT DISTINCT activities.*, global_books.title, users.id AS friend_id, users.email AS friend_email, users.full AS friend_full, users.picture AS friend_picture FROM friendships 
        JOIN users 
            ON (friendships.user_id_1 = users.id OR friendships.user_id_2 = users.id)
        JOIN activities ON users.id = activities.user_id
        JOIN global_books ON global_books.id = activities.object_id
        WHERE ( friendships.user_id_1 = ${userId}
            OR friendships.user_id_2 = ${userId} )`;
        db.query(query, (err, results, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
