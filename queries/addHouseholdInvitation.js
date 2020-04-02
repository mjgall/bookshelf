const db = require('../config/db/mysql').pool;

module.exports = (initiatingUser, householdId, invitedUser) => {
  console.log(householdId)
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO households_users (user_id, household_id, is_owner, invite_accepted, inviter_id) VALUES ('${invitedUser}', '${householdId}', false, false, '${initiatingUser}')`
    
    db.query(query, (err, results, fields) => {
      if (err) throw Error(err)
      db.query(`SELECT * FROM households_users WHERE id = ${results.insertId}`, (err, results, fields) => {
        if (err) throw Error(err)
        resolve(results[0])
      })
    })

  });
};
