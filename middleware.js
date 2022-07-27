const helper = require('./helper');

let PRIVATE_KEY = "halo-semua-nya";

module.exports = {

    check_authorization(req, res, next) {
        let header_authorization = req.header('authorization');
        if (header_authorization) {
            let token = header_authorization.split(" ")[1]
            if (!helper.check_token(token)) { //check if token is in token.js
                res.status(401).send({ "status": "Error", "message": "user not logged in" });
                return;
            }
        } else {
            res.status(401).send({ "status": "Error", "message": "user not logged in" });
            return;
        }
        next();
    }

}