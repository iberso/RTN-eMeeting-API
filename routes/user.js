const helper = require('../helper');
const pool = require('../database');
let util = require('util');
const uuid = require('uuid');
const bcrypt = require("bcrypt");

async function get_user(nik) {
    try {
        data = await pool.query('SELECT nik,username,email_address,id_role,device_token,phone_number,gender,date_of_birth FROM user WHERE nik = ?', [nik])
        if (data.length != 0) {
            return helper.http_response(data[0], 'Success', null);
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

async function add_user(user) {
    let api_response = await get_user(user.nik);
    if (api_response.status_code === 200) {
        return helper.http_response(null, 'Error', 'User already exist', 404)
    }
    const hash_password = await bcrypt.hash(user.date_of_birth.split('-').join(""), 10);

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
    try {
        await pool.query(sql, value);
        data = {
            'nik': user.nik,
            'username': user.username,
            'email_address': user.email_address,
            'id_role': user.id_role,
            'password': user.date_of_birth.split('-').join(""),
            'device_token': user.device_token,
            'phone_number': user.phone_number,
            'gender': user.gender,
            'date_of_birth': user.date_of_birth
        }
        return helper.http_response(data, 'Success', "Account created successfully", 201);
    } catch (err) {
        return helper.http_response(null, 'Error', "Database error occurred: " + err.message, 500)
    }
}

async function edit_user(user, nik) {
    let api_response = await get_user(nik);
    if (api_response.status_code === 404) {
        return helper.http_response(null, 'Error', 'User not found', 404)
    }

    let sql = 'UPDATE user SET username = ?, email_address = ?, id_role = ?, device_token = ?, phone_number = ?, gender = ?, date_of_birth = ? WHERE nik = ?';

    let value = [
        user.username,
        user.email_address,
        user.id_role,
        user.device_token,
        user.phone_number,
        user.gender,
        user.date_of_birth,
        nik
    ];
    try {
        await pool.query(sql, value);
        data = {
            'nik': nik,
            'username': user.username,
            'email_address': user.email_address,
            'id_role': user.id_role,
            'device_token': user.device_token,
            'phone_number': user.phone_number,
            'gender': user.gender,
            'date_of_birth': user.date_of_birth
        }
        return helper.http_response(data, 'Success', "Account updated successfully");
    } catch (err) {
        return helper.http_response(null, 'Error', "Database error occurred: " + err.message, 500)
    }

}



module.exports = { get_user, get_all_users, add_user, edit_user };