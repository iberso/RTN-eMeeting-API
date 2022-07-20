let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_emeeting'
});

function getUsers() {
    connection.connect();

    connection.query('SELECT * FROM role', function(error, results, fields) {
        if (error) throw error;
        console.log(results);
    });

    connection.end();
}


module.exports = { getUsers };