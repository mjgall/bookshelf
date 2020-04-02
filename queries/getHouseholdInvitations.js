const db = require('../config/db/mysql').pool;

module.exports = userID => {
  return new Promise((resolve, reject) => {
    
    const query = `SELECT bookshelf.household_invitations.*, inviter.email AS inviter_email, invited.email AS invited_email FROM bookshelf.household_invitations JOIN bookshelf.users AS inviter ON bookshelf.household_invitations.user_id_1 = inviter.id JOIN bookshelf.users AS invited ON bookshelf.household_invitations.user_id_2 = invited.id WHERE user_id_1 = ${userID} OR user_id_2 = ${userID};`;
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err);
      resolve(results);
    });
  });
};
