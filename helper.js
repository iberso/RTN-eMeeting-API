const bcrypt = require("bcrypt");

function http_response(data = null, status = null, message = null, status_code = 200) {
    let body = {};
    body.status = status;

    if (message != null) {
        body.message = message;
    }

    if (data != null) {
        body.data = data;
    }

    return { status_code, body };
}

function hash_password(plain_text) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(plain_text, salt, function(err, hash) {
            return hash;
        });
    })
}
module.exports = {
    http_response,
    hash_password
}