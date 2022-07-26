let util = require('util');
const bcrypt = require("bcrypt");
const { resolve } = require('path');
const { rejects } = require('assert');

function http_response(data = null, status = null, message = null, status_code = 200, token = null) {
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
}

function hash_password(plain_text) {
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
}
module.exports = {
    http_response,
    hash_password
}