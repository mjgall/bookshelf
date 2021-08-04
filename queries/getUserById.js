const db = require('../config/db/mysql').pool;

module.exports = userID => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE id = ${userID};`;
    console.log(query);
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results[0]);
    });
  });
};
