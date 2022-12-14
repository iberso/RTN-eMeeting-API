const helper = require("../helper");
const pool = require('../database');

module.exports = {
    async get_all_room_by_status(status) {

        if (!status.current_meeting_id) return helper.http_response(null, 'error', 'current meeting id is not present in body', 400);
        if (!status.date) return helper.http_response(null, 'error', 'date is not present in body', 400);
        if (!status.time_start) return helper.http_response(null, 'error', 'time_start is not present in body', 400);
        if (!status.time_end) return helper.http_response(null, 'error', 'time_end is not present in body', 400);

        try {
            const rooms_query = 'SELECT r.id, r.room_name,IF((SELECT COUNT(*) FROM meeting WHERE id != ? AND id_room = r.id AND date = ? AND time_start < ? AND time_end > ?) = 0,"true","false") AS is_available FROM room r ORDER BY is_available ASC';
            const rooms_query_values = [status.current_meeting_id, status.date, status.time_end, status.time_start];
            const rooms_data = await pool.query(rooms_query, rooms_query_values);

            return helper.http_response(rooms_data, 'success', null);
        } catch (err) {
            return helper.http_response(null, 'error', "database error occurred: " + err.message, 500)
        }
    },
    async get_all_room() {
        try {
            let rooms_query = 'SELECT * FROM room';
            let rooms_data = await pool.query(rooms_query);
            return helper.http_response(rooms_data, 'success', null);
        } catch (err) {
            return helper.http_response(null, 'error', "database error occurred: " + err.message, 500)
        }
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
            return helper.http_response(null, 'success', 'room created successfully', 201);
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    },
    async edit_room(room_name, id_room) {
        if (!id_room) return helper.http_response(null, 'error', 'id is not present in body', 400)
        if (!room_name) return helper.http_response(null, 'error', 'room_name is not present in body', 400)

        let api_response = await this.get_room_by_id(id_room);
        if (api_response.status_code === 404) return helper.http_response(null, 'error', 'room not found', 404);

        try {
            await pool.query('UPDATE room set room_name = ? WHERE id = ?', [room_name, id_room])
            return helper.http_response(null, 'success', 'room updated successfully');
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    }
}