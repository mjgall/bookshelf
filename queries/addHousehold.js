const db = require('../config/db/mysql').pool;
const sqlString = require('sqlstring');

module.exports = (name, userId) => {
  return new Promise((resolve, rejects) => {
    const addHouseholdQuery = `INSERT INTO households (name, create_date) VALUES (${sqlString.escape(
      name
    )}, '${Date.now()}');`;

    db.query(addHouseholdQuery, (err, results, fields) => {
      if (err) throw Error(err);
      const addHouseholdsUsersQuery = `INSERT INTO households_users (user_id, household_id, is_owner, invite_accepted) VALUES ('${userId}', '${results.insertId}', true, true)`;
      db.query(addHouseholdsUsersQuery, (err, results, fields) => {
        if (err) throw Error(err);
        db.query(
          `SELECT * FROM households_users WHERE id = ${results.insertId}`,
          (err, results, fields) => {
            if (err) throw Error(err);
            resolve({ ...results[0], household_name: name });
          }
        );
      });
    });
  });
};
