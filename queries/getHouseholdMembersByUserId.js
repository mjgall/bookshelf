const db = require('../config/db/mysql').pool;

module.exports = userId => {
  return new Promise((resolve, reject) => {
    const query = `SELECT households_users.*, users.email AS member_email FROM households_users JOIN users ON users.id = households_users.user_id WHERE household_id IN (SELECT household_id FROM households_users WHERE user_id = ${userId} AND is_owner = true)`;
    console.log(query);

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      console.log(results);
      resolve(results);
    });
  });
};
