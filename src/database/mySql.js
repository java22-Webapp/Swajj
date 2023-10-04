const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',
  user: 'developer',
  password: 'password',
  database: 'mysql_db',
  port: 3306
};

let connection;

async function initializeDB() {
  connection = await mysql.createConnection(dbConfig);
  return connection;
}

module.exports = {
  initializeDB,
  getConnection: () => connection
};
