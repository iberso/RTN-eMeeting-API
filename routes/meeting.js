const helper = require("../helper");
const pool = require('../database');
const uuid = require('uuid');

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
    },
    async add_meeting(meeting, nik) {
        if (!meeting.topic) return helper.http_response(null, 'error', 'meeting is not present in body', 400);
        if (!meeting.time_start) return helper.http_response(null, 'error', 'time_start is not present in body', 400);
        if (!meeting.time_end) return helper.http_response(null, 'error', 'time_end is not present in body', 400);
        if (!meeting.date) return helper.http_response(null, 'error', 'date is not present in body', 400);
        if (!meeting.type) return helper.http_response(null, 'error', 'time_end is not present in body', 400);
        if (!meeting.notification_type) return helper.http_response(null, 'error', 'notification_type is not present in body', 400);

        const uuid_meeting = uuid.v4();
        let meeting_query_key = ['id', 'topic', 'time_start', 'time_end', 'date', 'type', 'notification_type'];
        let meeting_values = [uuid_meeting, meeting.topic, meeting.time_start, meeting.time_end, meeting.date, meeting.type, meeting.notification_type];
        let meeting_values_placeholder = helper.generate_values_placeholder(meeting_query_key);

        if (meeting.type === 'Online') {
            if (!meeting.meeting_link) return helper.http_response(null, 'error', 'meeting_link is not present in body', 400);
            meeting_query_key.push('meeting_link');
            meeting_values.push(meeting.meeting_link);
        } else if (meeting.type === 'Onsite') {
            if (!meeting.id_room) return helper.http_response(null, 'error', 'id_room is not present in body', 400);
            meeting_query_key.push('id_room');
            meeting_values.push(meeting.id_room);
        } else if (meeting.type === 'Hybird') {
            if (!meeting.meeting_link && !meeting.id_room) return helper.http_response(null, 'error', 'meeting_link and id_room is not present in body', 400);
            meeting_query_key.push('id_room');
            meeting_values.push(meeting.id_room);
            meeting_query_key.push('meeting_link');
            meeting_values.push(meeting.meeting_link);
        } else {
            return helper.http_response(null, 'error', 'meeting_type is not valid, meeting_type must be in ["Online","Onsite","Hybird"]', 400);
        }

        let notif_type = ['Email', 'Push Notification'];
        if (!(notif_type.includes(meeting.notification_type))) {
            return helper.http_response(null, 'error', 'notification_type is not valid, notification_type must be in ["Enail", "Push Notification"]', 400);
        }

        let meeting_query = 'INSERT INTO meeting (' + meeting_query_key.join(',') + ') VALUES (' + meeting_values_placeholder + ')';

        try {
            await pool.query(meeting_query, meeting_values);
            //TODO : add all participants to meeting_participant table

            return helper.http_response(null, 'success', "meeting created successfully", 201);
        } catch (err) {
            return helper.http_response(null, 'error', "database error occurred: " + err.message, 500)
        }
    },

    async get_all_users_by_meeting_status(nik_host, date, time_start, time_end) {
        if (!nik_host) return helper.http_response(null, 'error', 'nik_host is not present in body', 400);
        if (!date) return helper.http_response(null, 'error', 'date is not present in body', 400);
        if (!time_start) return helper.http_response(null, 'error', 'time_start is not present in body', 400);
        if (!time_end) return helper.http_response(null, 'error', 'time_end is not present in body', 400);

        let api_response = await this.get_user(user.nik);
        if (api_response.status_code != 200) return helper.http_response(null, 'error', 'User not found', 404);

        try {
            let users_query = 'SELECT mp.id_participant, u.email_address, mp.participant_type, IF(mp.approve_notulensi = 1,"true","false") AS approve_notulensi,IF(mp.attendance = 1,"true","false") AS attendance, IF(m.date = ? AND m.time_start = ? AND m.time_end = ?,"true","false") AS is_busy FROM meeting_participant mp JOIN meeting m ON mp.id_meeting = m.id JOIN user u ON u.nik = mp.id_participant WHERE mp.id_participant != ?';
            let users_query_values = [date, time_start, time_end, nik_host];
            let users_data = await pool.query(users_query, users_query_values);

            return helper.http_response(users_data, 'success', null);
        } catch (err) {
            return helper.http_response(null, 'error', "database error occurred: " + err.message, 500)
        }
    },

    async add_participant(id_meeting, participants) {
        try {

        } catch (err) {
            return helper.http_response(null, 'error', "database error occurred: " + err.message, 500)
        }
    }
}