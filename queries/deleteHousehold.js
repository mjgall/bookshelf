const db = require('../config/db/mysql').pool;

module.exports = (householdId) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE households, households_users FROM households INNER JOIN households_users ON households.id = households_users.household_id WHERE households.id = ${householdId} AND households_users.household_id = '${householdId}'`;
    console.log(query);

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results);
    });
  });
};
//Error Code: 1064. You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'households_users ON' at line 1

//Error Code: 1064. You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '.household_id WHERE id = 67' at line 1

//Error Code: 1064. You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'households.' at line 1
