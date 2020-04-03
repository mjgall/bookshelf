const db = require('../config/db/mysql').pool;

module.exports = userId => {
  return new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT households_users.*, users.email AS member_email, users.picture, inviters.email AS inviter_email, inviters.full AS inviter_full, households.name AS household_name

    FROM households_users
    
    JOIN users 
    ON users.id = households_users.user_id
    
    JOIN households
    ON households_users.household_id = households.id
    
    LEFT OUTER JOIN users AS inviters
    ON inviters.id = households_users.inviter_id
    
    WHERE invite_declined = false AND household_id 
    IN (SELECT household_id FROM households_users WHERE user_id = ${userId} )`;


    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);

      resolve(results);
    });
  });
};
