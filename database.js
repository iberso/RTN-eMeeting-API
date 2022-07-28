let mysql = require('mysql');
let util = require('util')
require('dotenv').config();

let pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    dateStrings: [
        'DATE',
        'DATETIME'
    ]
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    console.log(`Database Status : ${connection.state}`)
    if (connection) connection.release()

    return
})

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query)

module.exports = pool