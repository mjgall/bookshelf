const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (bookId, lenderId, borrowerId, startDate, requesting) => {
  return new Promise((resolve, reject) => {
    if (requesting) {
      query = `INSERT INTO loans (global_id, lender_id, borrower_id) VALUES (${bookId}, ${lenderId}, ${borrowerId})`;
    } else {
      query = `INSERT INTO loans (global_id, lender_id, borrower_id, start_date) VALUES (${bookId}, ${lenderId}, ${borrowerId}, '${startDate}')`;
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
