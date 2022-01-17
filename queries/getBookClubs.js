const db = require('../config/db/mysql').pool;

module.exports = userId => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM book_clubs_users JOIN book_clubs ON book_clubs.id = book_clubs_users.book_club_id WHERE user_id = ${userId} AND invite_accepted = TRUE AND invite_declined = FALSE;`;
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results);
    });
  });
};
