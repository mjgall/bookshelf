const db = require('../config/db/mysql').pool;

module.exports = (householdId, userId) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE households_users, households_books FROM households_books LEFT JOIN households_users ON households_users.household_id = households_books.household_id WHERE households_books.user_id = ${userId} AND households_books.household_id = ${householdId} AND households_users.user_id = ${userId}`;
    console.log(query)
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results);
    });
  });
};
