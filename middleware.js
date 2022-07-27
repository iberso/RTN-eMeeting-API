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
                    res.status(200).send({ "status": "Success", "message": "User allready logged in" })
                } else {
                    next();
                }
            });
        } else {
            next();
        }
    }
    // check_authorization(req, res, next) {
    //     let header_authorization = req.header('authorization');
    //     if (header_authorization) {
    //         let result = helper.verify_token(req)
    //         result.then(function(value) {
    //             if (value.status_code != 401) {
    //                 next();
    //             } else {
    //                 res.status(value.status_code).send(value.body);
    //                 return;
    //             }
    //         });
    //     } else {
    //         res.status(401).send({ "status": "Error", "message": "User are not logged in" });
    //         return;
    //     }
    // },

    // check_login(req, res, next) {
    //     let header_authorization = req.header('authorization');
    //     console.log(header_authorization)
    //     if (header_authorization) {
    //         let result = helper.verify_token(req)
    //         result.then(function(value) {
    //             if (value.status_code === 200) {
    //                 res.status(value.status_code).send({ "status": "Success", "message": "Allready logged in" })
    //                 return;
    //             }
    //         });
    //     } else {
    //         console.log("undefines")
    //             // next();
    //     }
    // }
}