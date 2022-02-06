const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");
const getGlobalBookByISBN = require("./getGlobalBookByISBN");

module.exports = (book) => {
  return new Promise(async (resolve, reject) => {
    const {
      userId,
      title,
      author,
      isbn,
      isbn10,
      isbn13,
      cover,
      id,
      manual,
      addGlobal,
    } = book;

    if (manual) {
      const item = [title, author];

      let globalStatement = `INSERT into global_books (title, author) VALUES (?)`;

      db.query(globalStatement, [item], (err, result, fields) => {
        if (err) {
          reject(err);
        } else {
          let userStatement = `INSERT INTO user_books (user_id, global_id, title, author) VALUES (${userId}, ${
            result.insertId
          }, ${sqlString.escape(title)}, ${sqlString.escape(author)}); `;

          db.query(userStatement, (err, result, fields) => {
            if (err) {
              reject(err);
            } else {
              db.query(
                `SELECT * FROM user_books WHERE id = ${result.insertId}`,
                (err, results, fields) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(results[0]);
                  }
                }
              );
            }
          });
        }
      });
    } else if (addGlobal) {
      const existingGlobal = await getGlobalBookByISBN(isbn10);

      if (!existingGlobal) {
        const globalAdd = `
				INSERT INTO global_books (title, author, isbn10, isbn13, cover) VALUES (${sqlString.escape(
          title
        )}, ${sqlString.escape(author)}, ${sqlString.escape(
          isbn10
        )}, ${sqlString.escape(isbn13)}, ${sqlString.escape(cover)});
				`;

        db.query(globalAdd, (err, results, fields) => {
          if (err) {
            reject(err);
          } else {
            let statement = `INSERT INTO user_books (user_id, global_id, title, author, isbn10, isbn13, cover) VALUES (?); `;

            const id = results.insertId;

            const item = [
              userId,
              id,
              title,
              author,
              isbn10 || null,
              isbn13 || null,
              cover || null,
            ];

            db.query(statement, [item], (err, results, fields) => {
              if (err) {
                reject(err);
              } else {
                db.query(
                  `SELECT * FROM user_books WHERE id = ${results.insertId}`,
                  (err, results, fields) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(results[0]);
                    }
                  }
                );
              }
            });
          }
        });
      } else {
        let statement = `INSERT INTO user_books (user_id, global_id, title, author, isbn10, isbn13, cover) VALUES (?); `;

        const item = [
          userId,
          existingGlobal.id,
          title,
          author,
          isbn10 || null,
          isbn13 || null,
          cover || null,
        ];

        db.query(statement, [item], (err, results, fields) => {
          if (err) {
            reject(err);
          } else {
            db.query(
              `SELECT * FROM user_books WHERE id = ${results.insertId}`,
              (err, results, fields) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(results[0]);
                }
              }
            );
          }
        });
      }
    } else {
      let statement = `INSERT INTO user_books (user_id, global_id, title, author, isbn10, isbn13, cover) VALUES (?); `;

      const item = [
        userId,
        id,
        title,
        author,
        isbn10 || null,
        isbn13 || null,
        cover || null,
      ];

      db.query(statement, [item], (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          db.query(
            `SELECT * FROM user_books WHERE id = ${results.insertId}`,
            (err, results, fields) => {
              if (err) {
                reject(err);
              } else {
                resolve(results[0]);
              }
            }
          );
        }
      });
    }
  });
};
