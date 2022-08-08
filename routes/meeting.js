const helper = require("../helper");
const pool = require('../database');

module.exports = {
    async get_user_meeting_by_date(nik, selected_date) {
        try {
            let data = await pool.query('SELECT m.id,m.topic,m.description,m.hasil_meeting,DATE_FORMAT(m.time_start,"%H:%i") AS time_start,DATE_FORMAT(time_end,"%H:%i") AS time_end,m.date,m.id_room,m.meeting_link,m.type,m.notification_type, (SELECT COUNT(*) FROM meeting_participant WHERE id_meeting = m.id ) AS participants FROM meeting m JOIN meeting_participant mp ON m.id=mp.id_meeting WHERE mp.id_participant = ? AND m.date = ?', [nik, selected_date]);
            if (data.length != 0) {
                return helper.http_response(data, 'success', null);
            } else {
                return helper.http_response(null, 'error', 'meeting not found', 404)
            }
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    },

    async get_user_all_meeting(nik) {
        try {
            let data = await pool.query('SELECT m.id,m.topic,m.description,m.hasil_meeting,DATE_FORMAT(m.time_start,"%H:%i") AS time_start,DATE_FORMAT(time_end,"%H:%i") AS time_end,m.date,m.id_room,m.meeting_link,m.type,m.notification_type, (SELECT COUNT(*) FROM meeting_participant WHERE id_meeting = m.id ) AS participants FROM meeting m JOIN meeting_participant mp ON m.id=mp.id_meeting WHERE mp.id_participant = ?', [nik]);
            if (data.length != 0) {
                return helper.http_response(data, 'success', null);
            } else {
                return helper.http_response(null, 'error', 'meeting not found', 404)
            }
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    },

    async get_meeting_by_meeting_id(id_meeting) {
        let meeting_query = 'SELECT * FROM meeting WHERE id = ?';
        let meeting_query_values = [id_meeting];
        try {
            let meeting_detail = await pool.query(meeting_query, meeting_query_values);
            if (meeting_detail.length != 0) {
                let participants_query = 'SELECT id_participant,participant_type,IF(approve_notulensi = 1,"true","false") AS approve_notulensi,IF(attendance = 1,"true","false") AS attendance FROM meeting_participant WHERE id_meeting = ? ORDER BY participant_type ASC';
                let participants_query_values = [id_meeting];
                let participants_data = await pool.query(participants_query, participants_query_values);

                let meeting = {
                    id: meeting_detail[0].id,
                    topic: meeting_detail[0].topic,
                    description: meeting_detail[0].description,
                    hasil_meeting: meeting_detail[0].hasil_meeting,
                    time_start: meeting_detail[0].time_start,
                    time_end: meeting_detail[0].time_end,
                    date: meeting_detail[0].date,
                    id_room: meeting_detail[0].id_room,
                    meeting_link: meeting_detail[0].meeting_link,
                    type: meeting_detail[0].type,
                    notification_type: meeting_detail[0].notification_type,
                    participants: participants_data

                }

                return helper.http_response(meeting, 'success', null);
            } else {
                return helper.http_response(null, 'error', 'meeting not found', 404)
            }
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    }
}