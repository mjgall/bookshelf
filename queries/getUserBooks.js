const db = require("../config/db/mysql").pool;

module.exports = (userId) => {
  return new Promise((resolve, reject) => {
    // const query = `SELECT id as user_book_id, user_id, global_id as id, title, author, isbn10, isbn13, cover, language, title_long, edition, pages, date_published, date_created, notes AS user_notes, \`read\`, null AS household_id FROM user_books WHERE user_id = ${userId}`;

    // const query = `SELECT DISTINCT user_books.id as user_book_id, user_books.user_id, user_books.global_id as id, user_books.title, user_books.author, user_books.isbn10, user_books.isbn13, user_books.cover, user_books.language, user_books.title_long, user_books.edition, user_books.pages, user_books.date_published, user_books.date_created, user_books.notes, user_books.read, user_books.private, user_books.started, null AS household_id FROM user_books LEFT JOIN users_globalbooks ON users_globalbooks.global_book_id = user_books.global_id WHERE user_books.user_id = ${userId} ORDER BY user_books.id DESC `;

    // const query = `SELECT DISTINCT loans.borrower_id, user_books.id as user_book_id, user_books.user_id, user_books.global_id as id, user_books.title, user_books.author, user_books.isbn10, user_books.isbn13, user_books.cover, user_books.language, user_books.title_long, user_books.edition, user_books.pages, user_books.date_published, user_books.date_created, user_books.notes, user_books.read, user_books.private, user_books.started, null AS household_id
    // FROM user_books
    // LEFT JOIN users_globalbooks ON users_globalbooks.global_book_id = user_books.global_id
    // LEFT JOIN loans ON loans.global_id = user_books.global_id
    // LEFT JOIN users ON users.id = loans.borrower_id
    // WHERE user_books.user_id = 1
    // GROUP BY user_books.id
    // ORDER BY user_books.id DESC`

    const query = `SELECT DISTINCT user_books.id as user_book_id, user_books.user_id, user_books.global_id as id, user_books.title, user_books.author, user_books.isbn10, user_books.isbn13, user_books.cover, user_books.language, user_books.title_long, user_books.edition, user_books.pages, user_books.date_published, user_books.date_created, user_books.notes, user_books.read, user_books.private, user_books.started, null AS household_id, user_books.on_loan, user_books.borrower_id, users.full, users.picture, users.shelf_id, users.shelf_enabled, loans.manual_name
    FROM user_books 
    LEFT JOIN users_globalbooks ON users_globalbooks.global_book_id = user_books.global_id
    LEFT JOIN loans ON loans.global_id = user_books.global_id
    LEFT JOIN users ON users.id = user_books.borrower_id
    WHERE user_books.user_id = ${userId}
    GROUP BY user_books.id
    ORDER BY user_books.id DESC`;

    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
        throw new Error(err);
      } else {
        resolve(results);
      }
    });
  });
};
