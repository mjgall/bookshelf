const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (name, userId) => {
  return new Promise((resolve, rejects) => {
    const addBookclubQuery = `INSERT INTO book_clubs (name, create_date) VALUES (${sqlString.escape(
      name
    )}, NOW());`;

    db.query(addBookclubQuery, (err, results, fields) => {
      if (err) throw Error(err);
      const addBookclubsUsersQuery = `INSERT INTO book_clubs_users (user_id, book_club_id, is_owner, invite_accepted) VALUES (${userId}, ${results.insertId}, true, true)`;
      db.query(addBookclubsUsersQuery, (err, results, fields) => {
        if (err) throw Error(err);
        db.query(
          `SELECT * FROM book_clubs_users INNER JOIN users ON users.id = ${userId} WHERE book_clubs_users.id = ${results.insertId}`,
          (err, results, fields) => {
            if (err) throw Error(err);
            resolve({ ...results[0], book_club_name: name });
          }
        );
      });
    });
  });
};
