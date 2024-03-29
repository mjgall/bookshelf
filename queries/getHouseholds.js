const db = require("../config/db/mysql").pool;

module.exports = (userID) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM households_users JOIN households ON households.id = households_users.household_id WHERE user_id = ${userID} AND invite_accepted = TRUE AND invite_declined = FALSE;`;

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);

      resolve(results);
    });
  });
};
