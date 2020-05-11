const db = require('../config/db/mysql').pool;

module.exports = (usersGlobalBookId) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users_globalbooks SET users_globalbooks.read = true WHERE id = ${usersGlobalBookId};;`;
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results);
    });
  });
};
