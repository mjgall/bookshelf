const db = require('../config/db/mysql').pool;
const sqlString = require('sqlstring');
const sendEmail = require('../services/aws-ses');
module.exports = (householdId, globalBookId, field, value, user) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO households_books (household_id, global_book_id, households_books.${field}) VALUES (${householdId}, ${globalBookId}, ${
      field === 'notes' ? sqlString.escape(value) : value
      }) ON DUPLICATE KEY UPDATE households_books.${field} = ${
      field === 'notes' ? sqlString.escape(value) : value
      };`;
    db.query(query, async (err, results, fields) => {
      if (err) throw Error(err);
      // await sendEmail('mike@gllghr.io', 'Updated household notes', `${user.full} updated the household notes on a book.`)
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
