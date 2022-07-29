let util = require('util');
const bcrypt = require("bcrypt");
const { resolve } = require('path');
const { rejects } = require('assert');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { json } = require('body-parser');
const nodemailer = require('nodemailer');

require('dotenv').config();

let tokens = [];
module.exports = {
    // async verify_token(req) {
    //     let token = this.get_token_from_headers(req);
    //     try {
    //         let result = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    //         if (this.check_token(token)) {
    //             if (result) {
    //                 return this.http_response(null, 'Success', 'token valid', 200)
    //             }
    //             this.remove_token(token)
    //             return this.http_response(null, 'Error', 'token Expired', 401)
    //         }
    //         return this.http_response(null, 'Error', 'token Expired', 401)
    //     } catch (err) {
    //         return this.http_response(null, 'Error', 'invalid token', 401)
    //     }
    // },

    async verify_token(req) {
        let token = this.get_token_from_headers(req);
        try {
            let result = await jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (result) {
                return this.http_response(null, 'Success', 'token valid', 200)
            } else {
                return this.http_response(null, 'Error', 'token Expired', 401)
            }
        } catch (err) {
            //catch if token invalid
            if (this.check_token(token)) {
                console.log("adanih")
            }
            return this.http_response(null, 'Error', 'invalid token', 401)
        }
    },

    http_response(data = null, status = null, message = null, status_code = 200, token = null) {
        let body = {};
        body.status = status;

        if (message != null) {
            body.message = message;
        }

        if (data != null) {
            body.data = data;
        }
        if (token != null) {
            body.token = token;
        }
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

    get_cookie(req) {
        let list_cookie = req.header('cookie').split("; ");
        let flag;
        for (let idx = 0; idx < list_cookie.length; idx++) {
            if (list_cookie[idx].match("SESSID=")) {
                flag = idx;
            }
        }
        if (flag) {
            console.log(list_cookie[flag]);
        }
    },

    send_mail(user_email, subject, text) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_APP_KEY
            }
        });

        let mailOption = {
            from: process.env.EMAIL_ADDRESS,
            to: user_email,
            subject: subject,
            text: text
        }

        transporter.sendMail(mailOption, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log("email send");
            }
        });
    }
}