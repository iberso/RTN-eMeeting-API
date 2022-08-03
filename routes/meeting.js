const helper = require("../helper");

module.exports = {
    async get_user_meeting_by_date(nik, selected_date) {
        try {
            let data = await pool.query('SELECT m.id,m.topic,m.description,m.hasil_meeting,m.time_start,m.time_end,m.date,m.id_room,m.meeting_link,m.type,m.notification_type FROM meeting m JOIN meeting_participant mp ON m.id=mp.id_meeting WHERE mp.id_participant= ? AND m.date = ?', [nik, selected_date]);
            if (data.length != 0) {
                return helper.http_response(data, 'Success', null);
            } else {
                return helper.http_response(null, 'Error', 'User not found', 404)
            }
        } catch (err) {
            return helper.http_response(null, 'Error', "Database error occurred: " + err.message, 500)
        }
    }
}