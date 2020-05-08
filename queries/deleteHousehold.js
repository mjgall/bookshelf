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
//Error Code: 1064. You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'households_users ON' at line 1

//Error Code: 1064. You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '.household_id WHERE id = 67' at line 1

//Error Code: 1064. You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'households.' at line 1
