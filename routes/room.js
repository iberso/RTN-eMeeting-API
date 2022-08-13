const helper = require("../helper");

module.exports = {
    async get_all_room() {

    },
    async get_room_by_id(id_room) {
        try {
            data = await pool.query('SELECT * FROM room WHERE id = ?', [id_room])
            if (data.length != 0) {
                return helper.http_response(data[0], 'success', null);
            } else {
                return helper.http_response(null, 'error', 'room not found', 404)
            }
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }

    },
    async add_room() {

    },
    async edit_room() {

    }
}