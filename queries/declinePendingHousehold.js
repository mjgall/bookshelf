const db = require('../config/db/mysql').pool;

module.exports = id => {
  
  return new Promise((resolve, reject) => {
    const query = `UPDATE households_users SET invite_declined = true WHERE id = ${id};`;

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);

      db.query(
        `SELECT * FROM households_users WHERE id = ${id}`,
        (err, results, fields) => {
          if (err) throw Error(err);
          resolve(results[0]);
        }
      );
    });
  });
};
