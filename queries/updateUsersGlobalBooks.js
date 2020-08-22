const db = require('../config/db/mysql').pool;
const sqlString = require('sqlstring');

module.exports = (userId, globalBookId, field, value) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO users_globalbooks (user_id, global_book_id, users_globalbooks.${field}) VALUES (${userId}, ${globalBookId}, ${
      field === 'notes' ? sqlString.escape(value) : value
    }) ON DUPLICATE KEY UPDATE users_globalbooks.${field} = ${
      field === 'notes' ? sqlString.escape(value) : value
    };`;
  
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      db.query(
        `SELECT * FROM users_globalbooks WHERE id = ${results.insertId}`,
        (err, results, fields) => {
          if (err) throw Error(err);
          resolve(results[0]);
        }
      );
    });
  });
};
