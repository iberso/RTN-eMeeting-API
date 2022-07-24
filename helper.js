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

module.exports = {
    http_response,
}