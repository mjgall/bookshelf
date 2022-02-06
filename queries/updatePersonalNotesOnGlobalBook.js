const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (usersGlobalBookId, notes) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users_globalbooks SET users_globalbooks.notes = ${sqlString.escape(
      notes
    )} WHERE id = ${usersGlobalBookId};`;

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      db.query(
        `SELECT * FROM users_globalbooks WHERE id = ${usersGlobalBookId}`,
        (err, results, fields) => {
          if (err) throw Error(err);
          resolve(results[0]);
        }
      );
    });
  });
};
