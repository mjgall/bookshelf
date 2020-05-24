const db = require('../config/db/mysql').pool;
   //here we need to add a new row for each household that the user is a part of
module.exports = (userId, globalBookId) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO households_books (global_book_id, household_id, user_id) SELECT '${globalBookId}' AS global_book_id, household_id, '${userId}' AS user_id FROM households_users JOIN households ON households.id = households_users.household_id WHERE user_id = ${userId};
    `;

    console.log(query)

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results);
    });

 
  });
};
