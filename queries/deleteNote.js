const db = require("../config/db/mysql").pool;

module.exports = (userId, noteId) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM book_clubs_notes WHERE id = ${noteId} AND user_id = ${userId}`;
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results);
    });
  });
};
