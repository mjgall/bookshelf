const db = require('../config/db/mysql').pool;
const sqlString = require('sqlstring');

module.exports = book => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE user_books SET title = ${sqlString.escape(
      book.title
    )}, author = ${sqlString.escape(book.author)}, notes = ${sqlString.escape(
      book.notes
    )}, \`read\` = ${sqlString.escape(book.read)} WHERE id = ${book.id};`;

    console.log(query);
    db.query(query, (err, results, fields) => {
      if (err) {
        throw Error(err);
      }
      resolve(results[0]);
    });
  });
};
