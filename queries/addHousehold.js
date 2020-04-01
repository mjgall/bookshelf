const db = require('../config/db/mysql').pool;

module.exports = (initiatingUser, invitedUser) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO households (user_id_1, user_id_2, accepted) VALUES ('${initiatingUser}', '${invitedUser}', false);`;
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      db.query(
        `SELECT * FROM households WHERE id = ${results.insertId};`,
        (err, results, fields) => {
          if (err) throw Error(err);
          resolve(results[0]);
        }
      );
    });
  });
};
