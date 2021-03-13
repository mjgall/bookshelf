const db = require('../config/db/mysql').pool;

module.exports = id => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM users`,
      (err, users, fields) => {
        if (err) {
          reject(err);
        }
        resolve(users);
      }
    );
  });
};
