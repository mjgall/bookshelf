const mysql = require("mysql");
const keys = require("../keys");

const pool = mysql.createPool({
  host: "in-out-tracker-restore.cm7jm7eozp0m.us-west-2.rds.amazonaws.com",
  user: keys.DB_MYSQL_USER,
  password: keys.DB_MYSQL_PASS,
  port: 3306,
  database: "bookshelf",
  acquireTimeout: 30000,
});

exports.pool = pool;
