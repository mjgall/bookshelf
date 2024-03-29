const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (userId, objectId, action, interactedUser, manualName) => {
  return new Promise((resolve, reject) => {
    let query;
    if (manualName) {
      query = `INSERT INTO activities (user_id, object_id, action, timestamp, manual_name) VALUES (${userId}, ${objectId}, ${action}, '${Date.now()}', '${manualName}')`;
    } else if (interactedUser) {
      query = `INSERT INTO activities (user_id, object_id, action, timestamp, interacted_user_id) VALUES (${userId}, ${objectId}, ${action}, '${Date.now()}', ${interactedUser})`;
    }
    else {
      query = `INSERT INTO activities (user_id, object_id, action, timestamp) VALUES (${userId}, ${objectId}, ${action}, '${Date.now()}')`;
    }

    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
