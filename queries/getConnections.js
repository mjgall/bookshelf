const db = require("../config/db/mysql").pool;

module.exports = (userId = 1) => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT DISTINCT households_users.id AS relationship_id, households_users.user_id, users.email, users.full, users.picture, "housemate" AS type

    FROM households_users
    
    JOIN users 
    ON users.id = households_users.user_id
    
    JOIN households
    ON households_users.household_id = households.id
    
    LEFT OUTER JOIN users AS inviters
    ON inviters.id = households_users.inviter_id
    
    WHERE invite_declined = false AND household_id
    IN (SELECT household_id FROM households_users WHERE user_id  = ${userId} AND households_users.invite_declined = FALSE)
    AND user_id != ${userId}
UNION
SELECT friendships.id AS relationship_id, (CASE friendships.user_id_1 WHEN ${userId} THEN friendships.user_id_2 ELSE friendships.user_id_1 END) as user_id, users.email, users.full, users.picture, "friend" AS type
FROM friendships 
        JOIN users 
            ON (friendships.user_id_1 = users.id OR friendships.user_id_2 = users.id) AND users.id <> ${userId}
        WHERE ( friendships.user_id_1  = ${userId}
            OR friendships.user_id_2  = ${userId} ) AND friendships.accepted = TRUE AND friendships.declined != TRUE`;
    db.query(query, (err, results, fields) => {
      if (err || !results) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
