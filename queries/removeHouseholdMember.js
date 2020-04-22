const db = require('../config/db/mysql').pool;

module.exports = (householdId, userId) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE households_users, households_books FROM households_users INNER JOIN households_books ON households_books.household_id = households_users.household_id WHERE households_users.user_id = ${userId} AND households_users.household_id = ${householdId}`;
    console.log(query)
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results);
    });
  });
};
