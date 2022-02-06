const db = require("../config/db/mysql").pool;

module.exports = (householdId, userId) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE households_users SET invite_declined = TRUE
        WHERE household_id = ${householdId}
        AND user_id = ${userId}`;

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results);
    });
  });
};
