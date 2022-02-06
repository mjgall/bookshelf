const db = require("../config/db/mysql").pool;

module.exports = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM users WHERE email = '${email}'`,
      (err, users, fields) => {
        if (err) {
          reject(err);
        } else if (users.length === 0) {
          resolve(null);
        }
        resolve(users[0]);
      }
    );
  });
};
