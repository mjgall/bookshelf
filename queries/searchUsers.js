const db = require("../config/db/mysql").pool;
const sqlString = require("sqlstring");

module.exports = (term) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE full LIKE '%${term}%'`

        db.query(query, (err, results, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
