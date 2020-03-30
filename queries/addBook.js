const db = require('../config/db/mysql').pool;

module.exports = book => {
  const { userId, title, author, isbn10, isbn13, cover } = book;

  const query1 = `
  
  
  INSERT INTO global_books (title, author, isbn10, isbn13, cover) VALUES ('${title}', '${author}', '${isbn10}', '${isbn13}', '${cover}');


  `;

  return new Promise((resolve, reject) => {
    db.getConnection((err, connnection) => {
      connnection.beginTransaction(err => {
        connnection.query(query1, (err, results, fields) => {
          const query2 = `
  
  INSERT INTO user_books (user_id, global_id, title, author, isbn10, isbn13, cover) VALUES (${userId}, ${results.insertId}, '${title}', '${author}', '${isbn10}', '${isbn13}', '${cover}');

  `;
          connnection.query(query2, (err, results2, fields) => {
            db.query(
              `SELECT * FROM user_books WHERE id = ${results2.insertId}`,
              (err, results, fields) => {
                resolve(results[0]);
              }
            );
          });
        });
      });

      connnection.commit();
      connnection.release();
    });
  });
};
