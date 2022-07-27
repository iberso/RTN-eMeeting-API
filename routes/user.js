const helper = require('../helper');
const pool = require('../database');
const jwt = require('jsonwebtoken');
let util = require('util');
const uuid = require('uuid');
const bcrypt = require("bcrypt");
require('dotenv').config();

module.exports = {
    async get_user(nik) {
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
    },

    async get_all_users() {
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
    },

    async login_user(user) {
        let api_response = await this.get_user(user.nik);
        if (api_response.status_code != 200) {
            return helper.http_response(null, 'Error', 'User not found', 404)
        }
        let sql = 'SELECT * FROM user WHERE nik = ?'
        let value = [user.nik]
        try {
            let data = await pool.query(sql, value);
            let res_data = {
                'nik': data[0].nik,
                'username': data[0].username,
                'email_address': data[0].email_address,
                'id_role': data[0].id_role,
                'device_token': data[0].device_token,
                'phone_number': data[0].phone_number,
                'gender': data[0].gender,
                'date_of_birth': data[0].date_of_birth
            }

            let result = await bcrypt.compare(user.password, data[0].password);
            if (result) {
                const token = await jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), data: res_data }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256' });
                helper.add_token(token)
                return helper.http_response(null, 'Success', "Successfully logged in", 200, token);
            } else {
                return helper.http_response(null, 'Unauthorized', "Invalid Credentials (Wrong Password)", 401)

            }
        } catch (err) {
            return helper.http_response(null, 'Error', "Database error occurred: " + err.message, 500)
        }
    },


    async logout_user(req) {
        let token = helper.get_token_from_headers(req);
        if (helper.check_token(token)) {
            helper.remove_token(token);
            return helper.http_response(null, 'Success', 'User logged out successfully')
        } else {
            return helper.http_response(null, 'Error', 'token invalid', 404)
        }
    },

    async add_user(user) {
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
    },

    async edit_user(user, nik) {
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

    },


};