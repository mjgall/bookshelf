const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT likes.* FROM likes 
        JOIN friendships ON ( friendships.user_id_1 = ${userId} OR friendships.user_id_2 = ${userId} ) = likes.liked_by`;
    db.query(query, (err, results, fields) => {
      if (err || !results) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
