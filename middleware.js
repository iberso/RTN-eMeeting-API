const helper = require('./helper');

let PRIVATE_KEY = "halo-semua-nya";

module.exports = {

    check_authorization(req, res, next) {
        let header_authorization = req.header('authorization');
        if (header_authorization) {
            let token = header_authorization.split(" ")[1]
                // if (!helper.check_token(token)) { //check if token is in token.js
                //     res.status(401).send({ "status": "Error", "message": "Token Invalid" });
                //     return;
                // }
            try {
                let result = await jwt.verify(token, PRIVATE_KEY);
                if (result) {
                    if (!helper.check_token(token)) {
                        res.status(401).send({ "status": "Error", "message": "token invalid" });
                        return
                    }
                    //return this.http_response(null, 'Success', 'token valid', 200)

                } else {
                    res.status(401).send({ "status": "Error", "message": "token invalid" });
                    return
                }
            } catch (err) {
                res.status(404).send({ "status": "Error", "message": "token expired" });
                return
            }
        } else {
            res.status(400).send({ "status": "Error", "message": "User are not logged in" });
            return;
        }
        next();
    }

}