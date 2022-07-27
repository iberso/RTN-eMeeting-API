const helper = require('./helper');


module.exports = {

    // check_authorization(req, res, next) {
    //     let header_authorization = req.header('authorization');
    //     if (header_authorization) {
    //         let result = helper.verify_token(req)
    //         result.then(function(value) {
    //             res.status(value.status_code).send(value.body)
    //         });
    //         return;
    //     } else {
    //         res.status(400).send({ "status": "Error", "message": "User are not logged in" });
    //         return;
    //     }

    //     next();
    // }
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
    }

}