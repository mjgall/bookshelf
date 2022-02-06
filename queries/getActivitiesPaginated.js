const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (userId, page, count) => {
  return new Promise((resolve, reject) => {
    const query = `
SELECT DISTINCT interacted_users.full AS interacted_user_name, activities.*, user_books.title, global_books.cover, users.id AS friend_id, users.email AS friend_email, users.full AS friend_full, users.picture AS friend_picture FROM friendships 
        JOIN users 
            ON ((friendships.user_id_1 = users.id OR friendships.user_id_2 = users.id) AND (friendships.accepted = TRUE AND friendships.declined != TRUE))
        JOIN activities ON users.id = activities.user_id
        LEFT JOIN users AS interacted_users ON activities.interacted_user_id = interacted_users.id
        JOIN global_books ON global_books.id = activities.object_id
        JOIN user_books ON global_books.id = user_books.global_id AND user_books.user_id = users.id AND user_books.private = FALSE
       
        WHERE ( friendships.user_id_1 = ${userId} OR friendships.user_id_2 = ${userId} ) AND activities.hidden = FALSE
UNION
SELECT DISTINCT interacted_users.full AS interacted_user_name, activities.*, global_books.title, global_books.cover, users.id AS friend_id, users.email AS friend_email, users.full AS friend_full, users.picture AS friend_picture 
FROM activities 
JOIN users ON users.id = activities.user_id
LEFT JOIN users AS interacted_users ON activities.interacted_user_id = interacted_users.id
JOIN global_books ON global_books.id = activities.object_id
JOIN user_books ON global_books.id = user_books.global_id AND user_books.private = FALSE
        WHERE activities.user_id = ${userId} AND activities.hidden = FALSE
ORDER BY timestamp DESC LIMIT ${(count || 10) * page - (count || 10)},${
      count || 10
    }
`;
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
