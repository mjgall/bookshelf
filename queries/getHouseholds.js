const db = require('../config/db/mysql').pool;

module.exports = userID => {
  return new Promise((resolve, reject) => {
    const query = `SELECT bookshelf.households.*, bookshelf.users.email AS invited_email FROM bookshelf.households INNER JOIN bookshelf.users ON bookshelf.households.user_id_2 = bookshelf.users.id WHERE user_id_1 = ${userID};`;
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results);
    });
  });
};
