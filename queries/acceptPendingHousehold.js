const db = require("../config/db/mysql").pool;

module.exports = (id) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE households_users SET invite_accepted = true WHERE id = ${id};`;

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      db.query(
        `SELECT households_users.*, households.name AS household_name FROM households_users JOIN households ON households_users.household_id = households.id WHERE households_users.id = ${id}`,
        (err, results, fields) => {
          if (err) throw Error(err);
          resolve(results[0]);
        }
      );
    });
  });
};
