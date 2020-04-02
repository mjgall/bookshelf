const db = require('../config/db/mysql').pool;

module.exports = userID => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM households_users JOIN households ON households.id = households_users.household_id WHERE user_id = ${userID};`;
    console.log(query);

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      console.log(results);
      resolve(results);
    });
  });
};
