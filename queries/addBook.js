const db = require('../config/db/mysql').pool;
const sqlString = require('sqlstring');

module.exports = (book) => {
  const { userId, title, author, isbn10, isbn13, cover } = book;

  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      connection.beginTransaction((err) => {
        connection.query(
          `SELECT * FROM global_books WHERE isbn10 = ${isbn10} OR isbn13 = ${isbn13}`,
          (err, results, fields) => {
            if (results.length > 0) {
              connection.query(
                `INSERT INTO user_books (user_id, global_id, title, author, isbn10, isbn13, cover) VALUES (${userId}, ${
                  results[0].id
                }, ${sqlString.escape(title)}, ${sqlString.escape(
                  author
                )}, ${sqlString.escape(isbn10)}, ${sqlString.escape(
                  isbn13
                )}, ${sqlString.escape(cover)});`,
                (err, results, fields) => {
                  if (err) throw Error(err);
                  connection.query(
                    `SELECT * FROM user_books WHERE id = ${results.insertId}`,
                    (err, results, fields) => {
                      if (err) throw Error(err);
                      resolve(results[0]);
                    }
                  );
                }
              );
            } else {
              const query1 = `
        INSERT INTO global_books (title, author, isbn10, isbn13, cover) VALUES (${sqlString.escape(
          title
        )}, ${sqlString.escape(author)}, ${sqlString.escape(
                isbn10
              )}, ${sqlString.escape(isbn13)}, ${sqlString.escape(cover)});
        `;

              connection.query(query1, (err, results, fields) => {
                const query2 = `
        
        INSERT INTO user_books (user_id, global_id, title, author, isbn10, isbn13, cover) VALUES (${userId}, ${
                  results.insertId
                }, ${sqlString.escape(title)}, ${sqlString.escape(
                  author
                )}, ${sqlString.escape(isbn10)}, ${sqlString.escape(
                  isbn13
                )}, ${sqlString.escape(cover)});
      
        `;

                connection.query(query2, (err, results2, fields) => {
                  db.query(
                    `SELECT * FROM user_books WHERE id = ${results2.insertId}`,
                    (err, results, fields) => {
                      resolve(results[0]);
                    }
                  );
                });
              });
            }
          }
        );
      });
      connection.commit();
      connection.release();
    });
  });
};
