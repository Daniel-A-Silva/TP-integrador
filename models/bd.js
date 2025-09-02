var mysql = require('mysql2');
var util = require('util');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.mysql_host || 'localhost',
    user: process.env.mysql_user || 'root', 
    password: process.env.mysql_password || '',
    database: process.env.mysql_db_name || 'franchucreations'   
});

pool.query = util.promisify(pool.query);
module.exports = pool;

pool.getConnection(function(err, connection) {
    if (err) {
        console.error('Error al conectar a MySQL:', err.message);
    } else {
        console.log('Conexión a MySQL exitosa');
        connection.release();
    }
});
