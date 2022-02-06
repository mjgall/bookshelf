const db = require("../config/db/mysql").pool;

module.exports = (connectingUser, friendshipId, action) => {
  let query;

  switch (action) {
    case "accept":
      query = `UPDATE friendships SET accepted = true WHERE id = ${friendshipId};`;
      break;
    case "decline":
      query = `UPDATE friendships SET declined = true WHERE id = ${friendshipId};`;
      break;
    default:
      break;
  }

  return new Promise((resolve, reject) => {
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      db.query(
        `SELECT * FROM friendships WHERE friendships.id = ${friendshipId}`,
        (err, results, fields) => {
          if (err) {
            reject(error);
            throw Error(err);
          }
          resolve(results[0]);
        }
      );
    });
  });
};
