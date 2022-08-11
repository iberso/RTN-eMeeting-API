let util = require('util');
const bcrypt = require("bcrypt");
const { resolve } = require('path');
const { rejects } = require('assert');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { json } = require('body-parser');
const nodemailer = require('nodemailer');
const mustache = require('mustache');

require('dotenv').config();

let tokens = [];
module.exports = {
    async verify_token(req) {
        let token = this.get_token_from_headers(req);
        try {
            let result = await jwt.verify(token, process.env.JWT_SECRET_KEY);
            return this.http_response(result.data, 'success', 'token valid', 200)
        } catch (err) {
            if (this.check_token(token)) {
                this.remove_token(token);
            }
            if (err.message === 'jwt expired') {
                return this.http_response(null, 'error', 'token expired', 401);
            } else {
                return this.http_response(null, 'error', 'invalid token', 401)
            }
        }
    },

    async extend_token(req) {
        let token = this.get_token_from_headers(req);
        if (token) {
            let result = await this.verify_token(req);
            if (result.status_code === 401 && result.body.message === "token expired") {
                let decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
                const new_token = await jwt.sign({
                    exp: Math.floor(Date.now() / 1000) +
                        parseInt(process.env.JWT_EXP_TIME_IN_SECONDS),
                    data: decoded.data
                }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256' });
                this.add_token(new_token);
                return this.http_response(null, 'success', null, 200, new_token);
            } else {
                return result;
            }
        } else {
            return this.http_response(null, 'error', 'user are not logged in', 403);
        }
    },

    http_response(data = null, status = null, message = null, status_code = 200, token = null) {
        let body = {};
        body.status = status;
        if (message != null) body.message = message;
        if (data != null) body.data = data;
        if (token != null) body.token = token;

        return { status_code, body };
    },

    hash_password(plain_text) {
        return new Promise((resolve, rejects) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(plain_text, salt, function(err, hash) {
                    if (err) {
                        return rejects(err);
                    }
                    return resolve(hash);
                });
            });
        });
    },

    add_token(client_token) {
        // let list_token = JSON.parse(fs.readFileSync('./files/token.json'));
        // console.log(list_token.tokens)
        // list_token.tokens.push(client_token)

        // console.log(list_token.tokens.length)
        // fs.writeFile('./files/token.json', JSON.stringify(list_token), (err) => {
        //     if (err) console.log('Error writing file:', err)
        // })
        tokens.push(client_token);
    },

    remove_token(client_token) {
        // let list_token = JSON.parse(fs.readFileSync('./files/token.json'));
        // let remaining_token = list_token.tokens.filter(data => data != client_token);
        // fs.writeFile('./files/token.json', JSON.stringify({ "tokens": remaining_token }), (err) => {
        //     if (err) console.log('Error writing file:', err)
        // })
        let new_list_tokens = tokens.filter(data => data != client_token);
        tokens = new_list_tokens;
    },

    check_token(client_token) {
        // let list_token = JSON.parse(fs.readFileSync('./files/token.json'));
        // let flag = false
        // for (let index = 0; index < list_token.tokens.length; index++) {
        //     if (list_token.tokens[index] === client_token) {
        //         return flag = true;
        //     }
        // }
        // return flag;
        let flag = false
        for (let index = 0; index < tokens.length; index++) {
            if (tokens[index] === client_token) {
                return flag = true;
            }
        }
        return flag;

    },

    get_all_tokens() {
        return tokens;
    },

    get_token_from_headers(req) {
        let header_authorization = req.header('authorization');
        if (header_authorization) {
            return header_authorization.split(" ")[1]
        }
    },

    send_mail(user_email, subject, default_password, email_address, text = null) {
        const template = fs.readFileSync('./template/index.html', 'utf8');

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_APP_KEY
            }
        });

        let mailOption = {
            from: {
                name: 'Rutan E-Meeting Mailer',
                address: process.env.EMAIL_ADDRESS
            },
            // from: process.env.EMAIL_ADDRESS,
            to: user_email,
            subject: subject,
            text: "this email is sending your account default password",
            html: mustache.render(template, { default_password, email_address }),
            attachments: [{
                filename: 'logo_rutan.png',
                path: './assets/images/logo_rutan.png',
                cid: 'logo_rutan'
            }]
        }

        transporter.sendMail(mailOption, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log("email send");
            }
        });
    },
    generate_values_placeholder(arr_key) {
        let placeholder = [];
        for (let idx = 0; idx < arr_key.length; idx++) {
            placeholder.push('?');
        }
        return placeholder.join(',')
    }
}