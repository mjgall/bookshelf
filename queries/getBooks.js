const db = require('../config/db/mysql').pool;

module.exports = (id) => {
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        `SELECT * FROM user_books WHERE user_id = '${id}'`,
        (err, books, fields) => {
          if (err) {
            reject(err);
          };

          resolve(books)
        }
      );
      connection.release();
    });
  }) 
  
}