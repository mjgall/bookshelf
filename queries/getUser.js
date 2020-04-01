const db = require('../config/db/mysql').pool;

module.exports = id => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT bookshelf.users.*, bookshelf.households.user_id_2 as household_member_id FROM bookshelf.users INNER JOIN bookshelf.households ON bookshelf.households.user_id_1 = bookshelf.users.id WHERE bookshelf.users.googleId = '${id}'`,
      (err, users, fields) => {
        if (err) {
          reject(err);
        }
        resolve(users[0]);
      }
    );
  });
};
