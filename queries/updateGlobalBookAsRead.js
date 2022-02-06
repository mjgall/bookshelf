const db = require("../config/db/mysql").pool;

module.exports = (globalBookId, value) => {
  return new Promise((resolve, reject) => {
    const query = `REPLACE INTO users_globalbooks (user_id, global_book_id, users_globalbooks.read) VALUES (${userId}, ${globalBookId}, ${value});`;

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);

      db.query(
        `SELECT * FROM users_globalbooks WHERE id = ${results.insertId}`,
        (err, results, fields) => {
          if (err) throw Error(err);
          resolve(results[0]);
        }
      );
    });
  });
};
