const mysql = require("mysql2");

/**
 * Using pool we can execute query and retuen connection object to pool
 * so we can create so-called connection pool
 * we can execute asynchronus db request
 * it avoid too many connection issue
 */
const pool = mysql.createPool({    
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_complete',
    port: 3307
});

module.exports = pool.promise();