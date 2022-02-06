const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (action, loan_id, user_books_id) => {
  return new Promise((resolve, reject) => {
    let query;
    let needsSecondQuery = false;
    let secondQuery;
    if (action === "end") {
      query = `UPDATE loans, user_books SET loans.end_date = '${Date.now()}', user_books.on_loan = FALSE, user_books.borrower_id = NULL WHERE loans.id = ${loan_id} AND user_books.id = ${user_books_id}`;
      needsSecondQuery = true;
      secondQuery = `SELECT borrowers.full AS borrower_full, lenders.full as lender_full, borrowers.id AS borrower_id, lenders.id AS lender_id, loans.* FROM loans 
			JOIN users borrowers ON loans.borrower_id = borrowers.id
			JOIN users lenders ON loans.lender_id = lenders.id
			WHERE loans.id = ${loan_id}`;
    }
    if (action === "grant") {
      query = `UPDATE loans, user_books SET loans.start_date = '${Date.now()}', user_books.on_loan = TRUE WHERE loans.id = ${loan_id} AND user_books.id = ${user_books_id}`;
      needsSecondQuery = true;
      secondQuery = `SELECT borrowers.full AS borrower_full, lenders.full as lender_full, borrowers.id AS borrower_id, lenders.id AS lender_id, loans.* FROM loans 
			JOIN users borrowers ON loans.borrower_id = borrowers.id
			JOIN users lenders ON loans.lender_id = lenders.id
			WHERE loans.id = ${loan_id}`;
    }
    if (action === "cancel") {
      query = `UPDATE loans, user_books SET loans.canceled = TRUE WHERE loans.id = ${loan_id}`;
      needsSecondQuery = true;
      secondQuery = `SELECT borrowers.full AS borrower_full, lenders.full as lender_full, borrowers.id AS borrower_id, lenders.id AS lender_id, loans.* FROM loans 
			JOIN users borrowers ON loans.borrower_id = borrowers.id
			JOIN users lenders ON loans.lender_id = lenders.id
			WHERE loans.id = ${loan_id}`;
    }
    if (action === "hide") {
      query = `UPDATE loans, user_books SET loans.hidden = TRUE WHERE loans.id = ${loan_id}`;
      needsSecondQuery = true;
      secondQuery = `SELECT borrowers.full AS borrower_full, lenders.full as lender_full, borrowers.id AS borrower_id, lenders.id AS lender_id, loans.* FROM loans 
			JOIN users borrowers ON loans.borrower_id = borrowers.id
			JOIN users lenders ON loans.lender_id = lenders.id
			WHERE loans.id = ${loan_id}`;
    }

    // else {
    // 	query = `INSERT INTO likes (activity_id, liked_by, timestamp) VALUES (${activityId}, ${likedBy}, '${Date.now()}')`;
    // }

    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        if (needsSecondQuery) {
          db.query(secondQuery, (err, results, fields) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        } else {
          resolve(results);
        }
      }
    });
  });
};
