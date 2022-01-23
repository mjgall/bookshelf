const db = require('../config/db/mysql').pool;

module.exports = (householdId) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE households, households_users, households_books FROM households LEFT JOIN households_books ON households_books.household_id = households.id LEFT JOIN households_users ON households_users.household_id = households.id WHERE households.id = ${householdId}`;
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results);
    });
  });
};
