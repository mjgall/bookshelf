const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (bookId, lenderId, borrowerId, startDate, requesting, manual_name) => {
  console.log({ bookId, lenderId, borrowerId, startDate, requesting, manual_name });
  let query
  return new Promise((resolve, reject) => {
    if (borrowerId) {
      if (requesting) {
        query = `INSERT INTO loans (global_id, lender_id, borrower_id) VALUES (${bookId}, ${lenderId}, ${borrowerId})`;
      } else {
        query = `INSERT INTO loans (global_id, lender_id, borrower_id, start_date) VALUES (${bookId}, ${lenderId}, ${borrowerId}, '${startDate}')`;
      }
    } else {
      query = `INSERT INTO loans (global_id, lender_id, start_date, manual_name) VALUES (${bookId}, ${lenderId}, '${startDate}', '${manual_name}')`
    }

    // const query = `INSERT INTO loans (global_id, lender_id, borrower_id, start_date) VALUES (${bookId}, ${lenderId}, ${borrowerId}, '${startDate}')`;
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        let query;
        if (requesting) {
          query = `UPDATE bookshelf.user_books SET borrower_id = ${borrowerId} WHERE user_id = ${lenderId} and global_id = ${bookId};`;
        } else {
          query = `UPDATE bookshelf.user_books SET on_loan = TRUE, borrower_id = ${borrowerId} WHERE user_id = ${lenderId} and global_id = ${bookId};`;
        }

        db.query(query, (err, results, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      }
    });
  });
};
