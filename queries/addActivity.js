const db = require('../config/db/mysql').pool;
const sqlString = require('sqlstring');

module.exports = (userId, objectId, action) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO activities (user_id, object_id, action, timestamp) VALUES (${userId}, ${objectId}, ${action}, '${Date.now()}')`
        console.log(query);
        db.query(query, (err, results, fields) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}