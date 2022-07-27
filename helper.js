let util = require('util');
const bcrypt = require("bcrypt");
const { resolve } = require('path');
const { rejects } = require('assert');

const fs = require('fs');
const { json } = require('body-parser');


module.exports = {
    async verify_token(token) {
        try {
            let result = await jwt.verify(token, PRIVATE_KEY);
            console.log(result)
            if (result) {
                return this.http_response(null, 'Success', 'token valid', 200)
            } else {
                return this.http_response(null, 'Error', 'token invalid', 404)
            }
        } catch (err) {
            if (this.check_token(token)) {
                this.remove_token(token)
                return this.http_response(null, 'Errorr', err, 404)
            } else {
                return this.http_response(null, 'Error', 'token Expired', 404)
            }
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
        let list_token = JSON.parse(fs.readFileSync('./files/token.json'));
        list_token.tokens.push(client_token)
        fs.writeFile('./files/token.json', JSON.stringify(list_token), (err) => {
            if (err) console.log('Error writing file:', err)
        })
    },

    remove_token(client_token) {
        let list_token = JSON.parse(fs.readFileSync('./files/token.json'));
        remaining_token = list_token.tokens.filter(data => data != client_token);
        fs.writeFile('./files/token.json', JSON.stringify({ "tokens": remaining_token }), (err) => {
            if (err) console.log('Error writing file:', err)
        })
    },

    check_token(client_token) {
        let list_token = JSON.parse(fs.readFileSync('./files/token.json'));
        let flag = false
        for (let index = 0; index < list_token.tokens.length; index++) {
            if (list_token.tokens[index] === client_token) {
                return flag = true;
            }
        }
        return flag;

    },

    get_token_from_headers(req) {
        let header_authorization = req.header('authorization');
        if (header_authorization) {
            return header_authorization.split(" ")[1]
        }
    }
}