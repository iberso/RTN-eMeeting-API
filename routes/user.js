const helper = require('../helper');
const pool = require('../database');
const jwt = require('jsonwebtoken');
let util = require('util');
const bcrypt = require("bcrypt");
const { urlencoded } = require('body-parser');

require('dotenv').config();

module.exports = {
    async edit_user_profile(file_path, nik) {
        const sql_user = 'SELECT * FROM user WHERE nik = ?';
        const value_user = [nik];
        const result = await pool.query(sql_user, value_user);

        if (result.length === 0) {
            return helper.http_response(null, 'error', 'User not found', 404)
        }

        try {
            let sql = 'UPDATE user SET profile_picture_path = ? WHERE nik = ?';
            let value = [file_path, nik];
            await pool.query(sql, value);
            return helper.http_response(null, 'success', 'User profile picture updated!');
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    },
    async get_user_profile(nik) {
        let sql = 'SELECT profile_picture_path FROM user WHERE nik = ?';
        let value = [nik];

        try {
            const data = await pool.query(sql, value);
            if (data.length != 0) {
                console.log(data[0].profile_picture_path)
                if (data[0].profile_picture_path != null && data[0].profile_picture_path != "") {
                    return helper.http_response(data[0].profile_picture_path, 'success', null);
                } else {
                    return helper.http_response('assets/images/user.png', 'success', null);
                }
            } else {
                return helper.http_response(null, 'error', 'User not found', 404)
            }
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    },
    async get_user(nik = null, req = null) {
        let user_nik;
        if (nik) {
            user_nik = nik;
        } else if (req) {
            let token = helper.get_token_from_headers(req);
            let decoded_token = jwt.decode(token, process.env['JWT_SECRET_KEY']);
            user_nik = decoded_token.data.nik;
        }
        try {
            data = await pool.query('SELECT nik,email_address,device_token FROM user WHERE nik = ?', [user_nik])
            if (data.length != 0) {
                return helper.http_response(data[0], 'success', null);
            } else {
                return helper.http_response(null, 'error', 'User not found', 404)
            }
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    },

    async get_all_users() {
        try {
            data = await pool.query('SELECT nik,email_address,device_token FROM user')
            if (data.length != 0) {
                return helper.http_response(data, 'success', null);
            } else {
                return helper.http_response(null, 'error', 'Data User is empty', 404)
            }
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    },

    async add_user(user) {
        if (!user.nik) return helper.http_response(null, 'error', 'nik is not present in body', 400);
        if (!user.email_address) return helper.http_response(null, 'error', 'email address is not present in body', 400);

        let api_response = await this.get_user(user.nik);
        if (api_response.status_code === 200) return helper.http_response(null, 'error', 'User already exist', 400);

        let default_password = Math.floor(100000 + Math.random() * 900000).toString();

        const hash_password = await bcrypt.hash(default_password, 10);

        let sql = 'INSERT INTO user (nik,email_address,password) VALUES (?,?,?)';
        let value = [
            user.nik,
            user.email_address,
            hash_password
        ];

        try {
            await pool.query(sql, value);
            data = {
                'nik': user.nik,
                'email_address': user.email_address,
            }
            helper.send_mail(user.email_address, "Your account has been registered", default_password, user.email_address);
            return helper.http_response(data, 'success', "Account created successfully!", 201);
        } catch (err) {
            return helper.http_response(null, 'error', "database error occurred: " + err.message, 500)
        }
    },

    async login_user(user) {
        if (!user.nik) return helper.http_response(null, 'error', 'nik is not present in body', 400);
        if (!user.password) return helper.http_response(null, 'error', 'password is not present in body', 400);

        let api_response = await this.get_user(user.nik);
        if (api_response.status_code != 200) return helper.http_response(null, 'error', 'User not found', 404);

        let sql = 'SELECT * FROM user WHERE nik = ?'
        let value = [user.nik]
        try {
            let data = await pool.query(sql, value);
            let res_data = {
                'nik': data[0].nik,
                'email_address': data[0].email_address,
                'device_token': data[0].device_token,
            }
            let result = await bcrypt.compare(user.password, data[0].password);
            if (result) {
                const token = await jwt.sign({
                    exp: Math.floor(Date.now() / 1000) +
                        parseInt(process.env['JWT_EXP_TIME_IN_SECONDS']),
                    data: res_data
                }, process.env['JWT_SECRET_KEY'], { algorithm: 'HS256' });
                helper.add_token(token)
                return helper.http_response(null, 'success', "Successfully logged in", 200, token);
            } else {
                return helper.http_response(null, 'Unauthorized', "Invalid Credentials (Wrong Password)", 401)
            }
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurredd: " + err, 500)
        }
    },

    async logout_user(req) {
        let token = helper.get_token_from_headers(req);
        if (helper.check_token(token)) {
            helper.remove_token(token);
            return helper.http_response(null, 'success', 'User logged out successfully')
        } else {
            return helper.http_response(null, 'error', 'token invalid', 401)
        }
    },

    async edit_user(req) {
        let user = req.body;
        if (!user.new_password && !user.email_address) return helper.http_response(null, 'error', 'new password or email address is not present in body', 400)

        let token = helper.get_token_from_headers(req);
        let decoded_token = jwt.decode(token)

        let api_response = await this.get_user(decoded_token.data.nik);
        if (api_response.status_code === 404) return helper.http_response(null, 'error', 'User not found', 404);

        const hash_password = await bcrypt.hash(user.new_password, 10);

        let sql = 'UPDATE user SET email_address = ?, password = ? WHERE nik = ?';

        let value = [
            user.email_address,
            hash_password,
            decoded_token.data.nik
        ];

        if (user.email_address && !user.password) {
            sql = 'UPDATE user SET email_address = ? WHERE nik = ?';
            value = [
                user.email_address,
                decoded_token.data.nik
            ];
        } else if (!user.email_address && user.password) {
            sql = 'UPDATE user SET password = ? WHERE nik = ?';
            value = [
                hash_password,
                decoded_token.data.nik
            ];
        }

        try {
            await pool.query(sql, value);
            data = {
                'nik': decoded_token.data.nik,
                'email_address': user.email_address,
            }
            return helper.http_response(data, 'success', "Account updated successfully");
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    },
    async change_password(token, data) {
        if (!token) return helper.http_response(null, 'error', 'token is not present', 400);
        if (!data.new_password) return helper.http_response(null, 'error', 'new_password is not present', 400);

        try {
            let result = await jwt.verify(token, process.env['JWT_SECRET_KEY']);

            let api_response = await this.get_user(result.data.nik);
            if (api_response.status_code === 404) return helper.http_response(null, 'error', 'User not found', 404);

            try {
                let result = await pool.query('SELECT password FROM user WHERE nik = ?', [result.data.nik]);
                if (await bcrypt.compare(data.new_password, result[0].password)) {
                    return helper.http_response(null, 'error', 'New password cannot be the same as old password', 400);
                }
            } catch (err) {
                return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
            }

            try {
                const hash_password = await bcrypt.hash(data.new_password.toString(), 10);
                let sql = 'UPDATE user SET password = ? WHERE nik = ?';
                let value = [
                    hash_password,
                    result.data.nik
                ];
                await pool.query(sql, value);

                return helper.http_response(null, 'success', "Password updated successfully");
            } catch (err) {
                return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
            }
        } catch (err) {
            if (err.message === 'jwt expired') {
                return helper.http_response(null, 'error', 'token expired', 401);
            } else {
                return helper.http_response(null, 'error', 'invalid token', 401)
            }
        }
    },
    async request_change_password(user) {
        if (!user.nik) return helper.http_response(null, 'error', 'nik is not present in body', 400);

        let api_response = await this.get_user(user.nik);
        if (api_response.status_code === 404) return helper.http_response(null, 'error', 'User not found', 404);

        let sql = 'SELECT email_address FROM user WHERE nik = ?'
        let value = [user.nik]

        try {
            let data = await pool.query(sql, value);

            const token = await jwt.sign({
                exp: Math.floor(Date.now() / 1000) + 300,
                data: { "nik": user.nik }
            }, process.env['JWT_SECRET_KEY'], { algorithm: 'HS256' });

            helper.send_mail_req_change_password(data[0].email_address, token);

            return helper.http_response(null, 'success', "Email sent successfully, passsword reset link sent to your email account");

        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurredd: " + err, 500)
        }
    }
};