const helper = require('../helper');
const pool = require('../database');
let util = require('util')

async function get_user(nik) {
    try {
        data = await pool.query('SELECT NIK,username,email_address,id_role,device_token,phone_number,gender,date_of_birth FROM user WHERE NIK = ?', [nik])
        if (data.length != 0) {
            return helper.http_response(data, 'Success', null);
        } else {
            return helper.http_response(null, 'Error', 'User not found', 404)
        }
    } catch (err) {
        return helper.http_response(null, 'Error', "Database error occurred: " + err.message, 500)
    }
}
async function get_all_users() {
    try {
        data = await pool.query('SELECT NIK,username,email_address,id_role,device_token,phone_number,gender,date_of_birth FROM user')
        if (data.length != 0) {
            return helper.http_response(data, 'Success', null);
        } else {
            return helper.http_response(null, 'Error', 'Data User is empty', 404)
        }
    } catch (err) {
        return helper.http_response(null, 'Error', "Database error occurred: " + err.message, 500)
    }
}

function get_all_user_roles() {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                console.log(err)
                reject(helper.http_response(null, 'Error', "Database error occurred: " + err.message, 500))
            } else {
                connection.query('SELECT * FROM role', function(error, results, fields) {
                    if (error) {
                        reject(helper.http_response(null, 'Error', "Database error occurred: " + error.message, 500))
                    } else {
                        let data = results;
                        if (data.length != 0) {
                            resolve(helper.http_response(data, 'Success', null))
                        } else {
                            resolve(helper.http_response(null, 'Error', 'Data Role is empty', 404))
                        }
                        connection.release();
                    }
                })
            }
        });
    });
}

function get_user_role_by_id(id_role) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                console.log(err)
                reject(helper.http_response(null, 'Error', "Database error occurred: " + err.message, 500))
            } else {
                connection.query('SELECT * FROM role WHERE id = ?', [id_role], function(error, results, fields) {
                    if (error) {
                        reject(helper.http_response(null, 'Error', "Database error occurred: " + error.message, 500))
                    } else {
                        let data = results;
                        if (data.length != 0) {
                            resolve(helper.http_response(data, 'Success', null))
                        } else {
                            resolve(helper.http_response(null, 'Error', 'Role not found', 404))
                        }
                        connection.release();
                    }
                })
            }
        });
    });
}


module.exports = { get_all_user_roles, get_user_role_by_id, get_user, get_all_users };