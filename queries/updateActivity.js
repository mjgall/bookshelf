const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (field, value, id) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE activities SET activities.${field} = ${value} WHERE id = ${id};`;

    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
        throw Error(err);
      }
      db.query(
        `SELECT * FROM activities WHERE id = ${id}`,
        (err, results, fields) => {
          if (err) {
            reject(err);
            throw Error(err);
          }
          resolve(results[0]);
        }
      );
    });
  });
};
