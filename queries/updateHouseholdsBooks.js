const db = require('../config/db/mysql').pool;
const sqlString = require('sqlstring');

module.exports = (householdId, globalBookId, field, value) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO households_books (household_id, global_book_id, households_books.${field}) VALUES (${householdId}, ${globalBookId}, ${
      field === 'notes' ? sqlString.escape(value) : value
    }) ON DUPLICATE KEY UPDATE households_books.${field} = ${
      field === 'notes' ? sqlString.escape(value) : value
    };`;
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      db.query(
        `SELECT * FROM households_books WHERE id = ${results.insertId}`,
        (err, results, fields) => {
          if (err) throw Error(err);
          resolve(results[0]);
        }
      );
    });
  });
};
