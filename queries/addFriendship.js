const db = require("../config/db/mysql").pool;

module.exports = (connectingUser, userEmail) => {
  return new Promise((resolve, reject) => {
    // const query = `INSERT INTO friendships (user_id_1, user_id_2, inviting_user_id) VALUES ('${connectingUser}', '${receivingUser}', '${connectingUser}')`
    const query = `INSERT INTO friendships (user_id_1, user_id_2, inviting_user_id) SELECT '${connectingUser}', users.id, '${connectingUser}' FROM users WHERE email = '${userEmail}'`;

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);

      if (results.affectedRows === 0) reject("No user email found");
      db.query(
        `SELECT * FROM friendships WHERE id = ${results.insertId}`,
        (err, results, fields) => {
          if (err) throw Error(err);
          resolve(results[0]);
        }
      );
    });
  });
};
