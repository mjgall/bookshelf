const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");
const sendEmail = require("../services/aws-ses");
module.exports = (field, value, bookType, householdsBookId, userBookId) => {
  return new Promise((resolve, reject) => {
    let query;
    if (bookType === "household") {
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
      db.query(
        bookType === "personal"
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
