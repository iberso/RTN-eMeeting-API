const helper = require("../helper");

module.exports = {
    async add_meeting() {

    },
    async get_meeting(req) {
        let token = helper.get_token_from_headers(req);
        let decoded_token = jwt.decode(token)

        try {
            data = await pool.query('SELECT * FROM meeting WHERE nik = ?', [nik])
            if (data.length != 0) {
                return helper.http_response(data[0], 'Success', null);
            } else {
                return helper.http_response(null, 'Error', 'User not found', 404)
            }
        } catch (err) {
            return helper.http_response(null, 'Error', "Database error occurred: " + err.message, 500)
        }
    },
    async get_all_user_meeting() {

    },
    async edit_meeting() {

    },
    async add_meeting_participants() {

    }
}