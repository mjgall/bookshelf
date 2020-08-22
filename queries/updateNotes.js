const db = require('../config/db/mysql').pool;
const sqlString = require('sqlstring');
const sendEmail = require('../services/aws-ses');
module.exports = (field, value, bookType, householdsBookId, userBookId) => {
  return new Promise((resolve, reject) => {
    let query;
    console.log(bookType)
    if (bookType === 'household') {
      query = `UPDATE households_books SET ${field} = ${sqlString.escape(
        value
      )} WHERE id = ${householdsBookId};`;

    } else {

      query = `UPDATE user_books SET ${field} = ${sqlString.escape(
        value
      )} WHERE id = ${userBookId};`;
    }

    db.query(query, async (err, results, fields) => {
      if (err) {
        reject(err);
        throw Error(err);
      }
      console.log('hello')
      if (bookType === 'household') {

        await sendEmail('mike@gllghr.io', 'Updated household notes', 'Someone updated the household notes on a book')
      }
      db.query(
        bookType === 'personal'
          ? `SELECT * FROM user_books WHERE id = ${userBookId}`
          : `SELECT * FROM households_books WHERE id = ${householdsBookId}`,
        (err, results, fields) => {
          if (err) {
            reject(err);
            throw Error(err);
          }
          resolve(results[0]);
        }
      );
    });
  });
};
