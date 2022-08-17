const helper = require("../helper");
const user = require('./user');
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
    async add_meeting(meeting) {
        if (!meeting.topic) return helper.http_response(null, 'error', 'topic is not present in body', 400);
        if (!meeting.time_start) return helper.http_response(null, 'error', 'time_start is not present in body', 400);
        if (!meeting.time_end) return helper.http_response(null, 'error', 'time_end is not present in body', 400);
        if (!meeting.date) return helper.http_response(null, 'error', 'date is not present in body', 400);
        if (!meeting.type) return helper.http_response(null, 'error', 'time_end is not present in body', 400);
        if (!meeting.notification_type) return helper.http_response(null, 'error', 'notification_type is not present in body', 400);

        if (!helper.is_time_format(meeting.time_start)) return helper.http_response(null, 'error', 'time_start is not in HH:mm format', 400);
        if (!helper.is_time_format(meeting.time_end)) return helper.http_response(null, 'error', 'time_end is not in HH:mm format', 400);

        const uuid_meeting = uuid.v4();
        let meeting_query_key = ['id', 'topic', 'time_start', 'time_end', 'date', 'type', 'notification_type'];
        let meeting_values = [uuid_meeting, meeting.topic, meeting.time_start, meeting.time_end, meeting.date, meeting.type, meeting.notification_type];

        if (meeting.description) {
            meeting_query_key.push('description');
            meeting_values.push(meeting.description);
        }

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
            return helper.http_response(null, 'error', 'notification_type is not valid, notification_type must be in ["Email", "Push Notification"]', 400);
        }

        let meeting_query = 'INSERT INTO meeting (' + meeting_query_key.join(',') + ') VALUES (' + helper.generate_values_placeholder(meeting_query_key) + ')';

        if (!meeting.participants) return helper.http_response(null, 'error', 'participants is not present in body', 400);
        try {
            await pool.query(meeting_query, meeting_values);
            try {
                let query = 'INSERT INTO meeting_participant (id,id_meeting,id_participant,participant_type) VALUES ?';
                let values = [meeting.participants.map(participant => [uuid.v4(), uuid_meeting, participant.nik, participant.type])];
                await pool.query(query, values);
                return helper.http_response(null, 'success', "meeting created successfully", 201);
            } catch (err) {
                return helper.http_response(null, 'error', "database error occurred: " + err.message, 500)
            }
        } catch (err) {
            return helper.http_response(null, 'error', "database error occurred: " + err.message, 500)
        }
    },
    async edit_meeting(meeting, id_meeting) {
        if (!id_meeting) return helper.http_response(null, 'error', 'id_meeting is not present', 400);
        if (!meeting.topic) return helper.http_response(null, 'error', 'topic is not present in body', 400);
        if (!meeting.time_start) return helper.http_response(null, 'error', 'time_start is not present in body', 400);
        if (!meeting.time_end) return helper.http_response(null, 'error', 'time_end is not present in body', 400);
        if (!meeting.date) return helper.http_response(null, 'error', 'date is not present in body', 400);
        if (!meeting.type) return helper.http_response(null, 'error', 'time_end is not present in body', 400);
        if (!meeting.notification_type) return helper.http_response(null, 'error', 'notification_type is not present in body', 400);

        let api_response = await this.get_room_by_id(id_meeting);
        if (api_response.status_code === 404) return helper.http_response(null, 'error', 'meeting not found', 404);

        if (!helper.is_time_format(meeting.time_start)) return helper.http_response(null, 'error', 'time_start is not in HH:mm format', 400);
        if (!helper.is_time_format(meeting.time_end)) return helper.http_response(null, 'error', 'time_end is not in HH:mm format', 400);

        let meeting_query_key = ['topic = ?', 'time_start = ?', 'time_end = ?', 'date = ?', 'type = ?', 'notification_type = ?'];
        let meeting_values = [meeting.topic, meeting.time_start, meeting.time_end, meeting.date, meeting.type, meeting.notification_type];

        if (meeting.description) {
            meeting_query_key.push('description');
            meeting_values.push(meeting.description);
        }

        if (meeting.type === 'Online') {
            if (!meeting.meeting_link) return helper.http_response(null, 'error', 'meeting_link is not present in body', 400);
            meeting_query_key.push('meeting_link = ?');
            meeting_values.push(meeting.meeting_link);
        } else if (meeting.type === 'Onsite') {
            if (!meeting.id_room) return helper.http_response(null, 'error', 'id_room is not present in body', 400);
            meeting_query_key.push('id_room = ?');
            meeting_values.push(meeting.id_room);
        } else if (meeting.type === 'Hybird') {
            if (!meeting.meeting_link && !meeting.id_room) return helper.http_response(null, 'error', 'meeting_link and id_room is not present in body', 400);
            meeting_query_key.push('id_room = ?');
            meeting_values.push(meeting.id_room);
            meeting_query_key.push('meeting_link = ?');
            meeting_values.push(meeting.meeting_link);
        } else {
            return helper.http_response(null, 'error', 'meeting_type is not valid, meeting_type must be in ["Online","Onsite","Hybird"]', 400);
        }

        let notif_type = ['Email', 'Push Notification'];
        if (!(notif_type.includes(meeting.notification_type))) {
            return helper.http_response(null, 'error', 'notification_type is not valid, notification_type must be in ["Email", "Push Notification"]', 400);
        }

        let meeting_query = 'UPDATE meeting set ' + meeting_query_key.join(',') + ' WHERE id = ?';
        meeting_values.push(id_meeting);

        if (!meeting.participants) return helper.http_response(null, 'error', 'participants is not present in body', 400);

        try {
            await pool.query(meeting_query, meeting_values);
            try {
                await pool.query('DELETE FROM meeting_participant WHERE id_meeting = ?', [id_meeting]);
                try {
                    let participant_query = 'INSERT INTO meeting_participant (id,id_meeting,id_participant,participant_type) VALUES ?';
                    let participant_values = [meeting.participants.map(participant => [uuid.v4(), id_meeting, participant.nik, participant.type])];

                    await pool.query(participant_query, participant_values);

                    return helper.http_response(null, 'success', "meeting updated successfully");
                } catch (err) {
                    return helper.http_response(null, 'error', "database error occurred: " + err.message, 500)
                }
            } catch (err) {
                return helper.http_response(null, 'error', "database error occurred: " + err.message, 500)
            }
        } catch (err) {
            return helper.http_response(null, 'error', "database error occurred: " + err.message, 500)
        }
    },
    async get_all_users(status) {
        if (!status.nik_host) return helper.http_response(null, 'error', 'nik_host is not present in body', 400);
        if (!status.date) return helper.http_response(null, 'error', 'date is not present in body', 400);
        if (!status.time_start) return helper.http_response(null, 'error', 'time_start is not present in body', 400);
        if (!status.time_end) return helper.http_response(null, 'error', 'time_end is not present in body', 400);

        let api_response = await user.get_user(status.nik_host);
        if (api_response.status_code != 200) return helper.http_response(null, 'error', 'User not found', 404);

        try {
            let users_query = 'SELECT u.nik,u.email_address,IF((SELECT COUNT(*) FROM meeting_participant mp JOIN meeting m ON mp.id_meeting = m.id WHERE m.date = ? AND (m.time_start < ? AND m.time_end > ?)) = 0,"false","true") AS is_busy FROM user u WHERE nik != ?';
            let users_query_values = [status.date, status.time_end, status.time_start, status.nik_host];
            let users_data = await pool.query(users_query, users_query_values);

            return helper.http_response(users_data, 'success', null);
        } catch (err) {
            return helper.http_response(null, 'error', "database error occurred: " + err.message, 500)
        }
    }
}