let util = require('util');
const bcrypt = require("bcrypt");
const { resolve } = require('path');
const { rejects } = require('assert');

const fs = require('fs');


module.exports = {
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
        let token_obj = { "value": client_token };
        list_token.tokens.push(token_obj)

        fs.writeFile('./files/token.json', JSON.stringify(list_token), (err) => {
            if (err) console.log('Error writing file:', err)
        })
    },

    remove_token(client_token) {
        let list_token = JSON.parse(fs.readFileSync('./files/token.json'));
        remaining_token = list_token.tokens.filter(data => data.value != client_token);
        console.log(remaining_token)
        fs.writeFile('./files/token.json', JSON.stringify(remaining_token), (err) => {
            if (err) console.log('Error writing file:', err)
        })
    },

    check_token(client_token) {
        let list_token = JSON.parse(fs.readFileSync('./files/token.json'));
        console.log(list_token)
        let flag = false
        list_token.tokens.forEach(token => {
            if (token.value === client_token) {
                return flag = true;
            }
        });
        return flag;
    },

    check_header(req, res, next) {


        let header_authorization = req.header('authorization');
        if (header_authorization) {
            let token = header_authorization.split(" ")[1]
            if (!helper.check_token(token)) {
                res.status(401).send({ "status": "Error", "message": "Unauthorized" });
                return;
            }
        }
        next();
    }
}