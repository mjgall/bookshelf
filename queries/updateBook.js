const db = require('../config/db/mysql').pool;
const sqlString = require('sqlstring');

// module.exports = book => {
//   return new Promise((resolve, reject) => {
//     const query = `UPDATE user_books SET title = ${sqlString.escape(
//       book.title
//     )}, author = ${sqlString.escape(book.author)}, notes = ${sqlString.escape(
//       book.notes
//     )}, \`read\` = ${sqlString.escape(book.read)} WHERE id = ${book.id};`;

//     db.query(query, (err, results, fields) => {
//       if (err) {
//         throw Error(err);
//       }
//       resolve(results[0]);
//     });
//   });
// };

module.exports = (field, value, id) => {
  return new Promise((resolve, reject) => {

    const query = `UPDATE user_books SET user_books.${field} = ${sqlString.escape(
      value
    )} WHERE id = ${id};`;
    
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
        throw Error(err);
      }
      db.query(
        `SELECT * FROM user_books WHERE id = ${id}`,
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
