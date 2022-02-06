const db = require("../config/db/mysql").pool;

module.exports = (userId, friendshipId) => {
  let query;
  if (friendshipId) {
    query = `
        SELECT friendships.id AS friendship_id, users.id AS user_id, users.email, users.full, users.picture FROM friendships 
        JOIN users 
            ON (friendships.user_id_1 = users.id OR friendships.user_id_2 = users.id) AND users.id <> ${userId}
        WHERE friendships.id = ${friendshipId}
            `;
  } else {
    query = `
        SELECT friendships.id AS friendship_id, friendships.accepted, friendships.declined, friendships.user_id_2, users.id AS user_id, users.email, users.full, users.picture, users.shelf_id FROM friendships 
        JOIN users 
            ON (friendships.user_id_1 = users.id OR friendships.user_id_2 = users.id) AND users.id <> ${userId}
        WHERE ( friendships.user_id_1 = ${userId}
            OR friendships.user_id_2 = ${userId} )
            `;
  }
  return new Promise((resolve, reject) => {
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      }
      if (friendshipId) {
        resolve(results[0]);
      } else {
        resolve(results);
      }
    });
  });
};
