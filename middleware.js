const helper = require('./helper');


module.exports = {

    check_authorization(req, res, next) {
        let header_authorization = req.header('authorization');
        if (header_authorization) {
            let result = helper.verify_token(req)
            result.then(function(value) {
                if (value.status_code != 401) {
                    next();
                } else {
                    res.status(value.status_code).send(value.body);
                    return;
                }
            });
        } else {
            res.status(401).send({ "status": "Error", "message": "User are not logged in" });
            return;
        }
    },

    check_login(req, res, next) {
        let header_authorization = req.header('authorization');
        if (header_authorization) {
            let result = helper.verify_token(req)
            result.then(function(value) {
                if (value.status_code === 200) {
                    if (helper.check_token(helper.get_token_from_headers(req))) {
                        res.status(value.status_code).send({ "status": "Success", "message": "Already logged in" });
                        return;
                    } else {
                        next();
                    }
                } else {
                    next();
                }
            });
        } else {
            next();
        }
    },

    check_body(req, res, next) {
        if (!Object.keys(req.body).length) {
            res.status(400).send({ "status": "Error", "message": "Body is missing" });
            return;
        } else {
            next();
        }
    }
}