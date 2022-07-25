const helper = require('../helper');
const pool = require('../database');
let util = require('util');
const uuid = require('uuid');
const bcrypt = require("bcrypt");

async function get_user(nik) {
    try {
        data = await pool.query('SELECT nik,username,email_address,id_role,device_token,phone_number,gender,date_of_birth FROM user WHERE nik = ?', [nik])
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
        data = await pool.query('SELECT nik,username,email_address,id_role,device_token,phone_number,gender,date_of_birth FROM user')
        if (data.length != 0) {
            return helper.http_response(data, 'Success', null);
        } else {
            return helper.http_response(null, 'Error', 'Data User is empty', 404)
        }
    } catch (err) {
        return helper.http_response(null, 'Error', "Database error occurred: " + err.message, 500)
    }
}
//TODO : make await to bcrpyt
async function add_user(user) {
    const hash_password = await bcrypt.hash(user.date_of_birth, 10);
    console.log(hash_password)
    let sql = 'INSERT INTO user (nik,username,email_address,id_role,password,device_token,phone_number,gender,date_of_birth) VALUES (?,?,?,?,?,?,?,?,?)';
    let value = [
        user.nik,
        user.username,
        user.email_address,
        user.id_role,
        hash_password,
        user.device_token,
        user.phone_number,
        user.gender,
        user.date_of_birth
    ];
    console.log("hai")
    try {
        data = await pool.query(sql, value);
        return helper.http_response(data, 'Success', null);
    } catch (err) {
        return helper.http_response(null, 'Error', "Database error occurred: " + err.message, 500)
    }
}




module.exports = { get_user, get_all_users, add_user };