const db = require('../config/db/mysql').pool;

module.exports = userId => {
  return new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT book_clubs_users.*, users.email AS member_email, users.first AS member_first, users.full AS member_full, users.picture, book_clubs.name AS book_club_name

    FROM book_clubs_users
    
    JOIN users 
    ON users.id = book_clubs_users.user_id
    
    JOIN book_clubs
    ON book_clubs_users.book_club_id = book_clubs.id
    
    WHERE invite_declined = false AND book_club_id 
    IN (SELECT book_club_id FROM book_clubs_users WHERE user_id = ${userId} AND book_clubs_users.invite_declined = FALSE)`;

    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);

      resolve(results);
    });
  });
};
