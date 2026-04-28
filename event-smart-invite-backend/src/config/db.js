const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'my_user', 
    password: '', 
    database: 'event_smart_invite' 
});

module.exports = pool;