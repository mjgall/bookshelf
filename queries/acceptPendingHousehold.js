const db = require('../config/db/mysql').pool;

module.exports = id => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE household_invitations SET accepted = true WHERE id = ${id};`;
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      db.query(
        `INSERT INTO households (user_id_1, user_id_2) VALUES ((SELECT user_id_1 FROM household_invitations WHERE id = ${id}), (SELECT user_id_2 FROM household_invitations WHERE id = ${id}))`,
        (err, results, fields) => {
          if (err) throw Error(err);
          db.query(
            `SELECT * FROM households WHERE id = ${results.insertId}`,
            (err, results, fields) => {
              if (err) throw Error(err);
              resolve(results[0]);
            }
          );
        }
      );
    });
  });
};
