const helper = require('../helper');
const pool = require('../database');
let util = require('util')

async function get_all_user_roles() {
    try {
        data = await pool.query('SELECT * FROM role')
        if (data.length != 0) {
            return helper.http_response(data, 'Success', null);
        } else {
            return helper.http_response(null, 'Error', 'Data Role is empty', 404)
        }
    } catch (err) {
        return helper.http_response(null, 'Error', "Database error occurred: " + err.message, 500)
    }
}

async function get_user_role_by_id(id_role) {
    try {
        data = await pool.query('SELECT * FROM role WHERE id = ?', [id_role])
        if (data.length != 0) {
            return helper.http_response(data, 'Success', null);
        } else {
            return helper.http_response(null, 'Error', 'Role not found', 404)
        }
    } catch (err) {
        return helper.http_response(null, 'Error', "Database error occurred: " + err.message, 500)
    }
}

module.exports = { get_all_user_roles, get_user_role_by_id };