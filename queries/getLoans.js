const db = require('../config/db/mysql').pool;
const sqlString = require('sqlstring');

module.exports = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM loans WHERE lender_id = ${userId} or borrower_id = ${userId}`
        
        db.query(query, (err, results, fields) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}