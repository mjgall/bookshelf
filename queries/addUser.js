const db = require('../config/db/mysql').pool;

module.exports = user => {
  const { googleId, first, last, email, picture, full } = user;

  const query = `INSERT INTO users (googleId, first, last, full, email, picture, create_date) VALUES ('${googleId}', '${first}', '${last}', '${full}', '${email}', '${picture}', NOW());`;

  return new Promise((resolve, reject) => {
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        db.getConnection((err, connection) => {
          connection.query(
            `SELECT * FROM users WHERE id = ${results.insertId}`,
            (err, users, fields) => {
              if (err) {
                reject(err);
              }
              resolve(users[0]);
            }
          );
        });
      }
    });
  });
};
