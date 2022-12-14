const helper = require('./helper');


module.exports = {
    check_authorization(req, res, next) {
        let header_authorization = req.header('authorization');
        if (header_authorization) {
            let result = helper.verify_token(req)
            result.then(function(value) {
                if (value.status_code === 200) {
                    next();
                } else {
                    res.status(value.status_code).send(value.body);
                    return;
                }
            });
        } else {
            res.status(403).send({ "status": "error", "message": "user are not logged in" });
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
                        res.status(value.status_code).send({ "status": "success", "message": "user already logged in" });
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
}