const db = require("../config/db/mysql").pool;

module.exports = () => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT (SELECT COUNT(*) FROM bookshelf.global_books) as books,(SELECT COUNT(*) FROM bookshelf.users) as users";
    db.query(query, (err, results, fields) => {
      if (err) {
        throw new Error(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};
