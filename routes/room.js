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
    async add_room(room) {
        if (!room.room_name) return helper.http_response(null, 'error', 'room_name is not present in body', 400)
        try {
            await pool.query('INSERT INTO room (room_name) VALUES (?)', [room.room_name])
            return helper.http_response(null, 'success created successfully', 201);
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    },
    async edit_room(room) {
        if (!room.id) return helper.http_response(null, 'error', 'id is not present in body', 400)
        if (!room.room_name) return helper.http_response(null, 'error', 'room_name is not present in body', 400)

        try {
            await pool.query('UPDATE room set room_name = ? WHERE id = ?', [room.room_name, room.id])
            return helper.http_response(null, 'room updated successfully');
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    }
}