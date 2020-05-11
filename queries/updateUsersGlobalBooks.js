const db = require('../config/db/mysql').pool;

module.exports = (acceptingUserId, householdId) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO users_globalbooks (user_id, global_book_id)
(SELECT ${acceptingUserId}, global_id FROM user_books
WHERE user_id = (SELECT user_id from households_users WHERE household_id = ${householdId} AND invite_accepted = true AND user_id != ${acceptingUserId}))`;

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results);
    });
  });
};
