const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (userId, field, value) => {
  return new Promise((resolve, reject) => {
    let query;

    if (field === "last_login") {
      query = `UPDATE users SET ${field} = NOW() WHERE users.id = ${userId}`;
    } else {
      query = `UPDATE users SET ${field} = ${sqlString.escape(
        value
      )} WHERE users.id = ${userId}`;
    }
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
