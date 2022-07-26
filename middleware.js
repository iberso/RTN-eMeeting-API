const helper = require('./helper');

module.exports = {
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