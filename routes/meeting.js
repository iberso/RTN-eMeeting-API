const helper = require("../helper");
const user = require('./user');
const room = require('./room');
const pool = require('../database');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const Moment = require('moment');

module.exports = {
    async get_all_meeting() {
        try {
            const date = new Date();
            const todayDate = Moment(date).format('YYYY-MM-DD');
            const data = await pool.query('SELECT id,time_start,notification_type FROM meeting WHERE date = ?', [todayDate]);
            return data;
        } catch (err) {
            console.log(err);
        }
    },
    async get_user_meeting_by_date(nik, selected_date) {
        if (!nik) return helper.http_response(null, 'error', 'nik is not present', 400);
        if (!selected_date) return helper.http_response(null, 'error', 'selected_date is not present', 400);

        let api_response = await user.get_user(nik);
        if (api_response.status_code === 404) return helper.http_response(null, 'error', 'User not found', 404);

        try {
            const data = await pool.query('SELECT m.id,m.topic,DATE_FORMAT(m.time_start,"%H:%i") AS time_start,DATE_FORMAT(time_end,"%H:%i") AS time_end,m.date,m.id_room,m.meeting_link,m.type,(SELECT COUNT(*) FROM meeting_participant WHERE id_meeting = m.id AND participant_type = "Notulis") AS notulis ,(SELECT COUNT(*) FROM meeting_participant WHERE id_meeting = m.id AND participant_type = "Participant") AS participants FROM meeting m JOIN meeting_participant mp ON m.id=mp.id_meeting WHERE mp.id_participant = ? AND m.date = ?', [nik, selected_date]);

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
        if (!nik) return helper.http_response(null, 'error', 'nik is not present', 400);

        let api_response = await user.get_user(nik);
        if (api_response.status_code === 404) return helper.http_response(null, 'error', 'User not found', 404);

        try {
            const data = await pool.query('SELECT m.id,m.topic,m.description,DATE_FORMAT(m.time_start,"%H:%i") AS time_start,DATE_FORMAT(time_end,"%H:%i") AS time_end,m.date,m.id_room,m.meeting_link,m.type,m.notification_type,(SELECT COUNT(*) FROM meeting_participant WHERE id_meeting = m.id AND participant_type = "Notulis") AS notulis ,(SELECT COUNT(*) FROM meeting_participant WHERE id_meeting = m.id AND participant_type = "Participant") AS participants FROM meeting m JOIN meeting_participant mp ON m.id=mp.id_meeting WHERE mp.id_participant = ? ORDER BY m.date DESC', [nik]);

            if (data.length != 0) {
                return helper.http_response(data, 'success', null);
            } else {
                return helper.http_response(null, 'error', 'meeting not found', 404)
            }
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    },
    async get_user_all_meeting_by_type(nik, user_type) {
        if (!nik) return helper.http_response(null, 'error', 'nik is not present', 400);

        let api_response = await user.get_user(nik);
        if (api_response.status_code === 404) return helper.http_response(null, 'error', 'User not found', 404);

        try {
            const data = await pool.query('SELECT m.id,m.topic,m.description,DATE_FORMAT(m.time_start,"%H:%i") AS time_start,DATE_FORMAT(time_end,"%H:%i") AS time_end,m.date,m.id_room,m.meeting_link,m.type,m.notification_type,(SELECT COUNT(*) FROM meeting_participant WHERE id_meeting = m.id AND participant_type = "Notulis") AS notulis ,(SELECT COUNT(*) FROM meeting_participant WHERE id_meeting = m.id AND participant_type = "Participant") AS participants FROM meeting m JOIN meeting_participant mp ON m.id=mp.id_meeting WHERE mp.id_participant = ? AND mp.participant_type = ? ORDER BY m.date DESC', [nik, user_type]);

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
        if (!id_meeting) return helper.http_response(null, 'error', 'id_meeting is not present', 400);

        let meeting_query = 'SELECT id,topic,description,DATE_FORMAT(time_start,"%H:%i") AS time_start,DATE_FORMAT(time_end,"%H:%i") AS time_end,date,id_room,meeting_link,type,notification_type FROM meeting WHERE id = ?';
        let meeting_query_values = [id_meeting];

        try {
            let meeting_detail = await pool.query(meeting_query, meeting_query_values);
            if (meeting_detail.length != 0) {
                // let participants_query = 'SELECT id_participant,participant_type,IF(approve_notulensi = 1,"true","false") AS approve_notulensi,IF(attendance = 1,"true","false") AS attendance FROM meeting_participant WHERE id_meeting = ? ORDER BY participant_type ASC';
                const participants_query = 'SELECT id_participant, participant_type, approval_status, IF(attendance = 1,"true","false") AS attendance FROM meeting_participant WHERE id_meeting = ? ORDER BY participant_type ASC';

                let participants_query_values = [id_meeting];
                let participants_data = await pool.query(participants_query, participants_query_values);

                //untuk mengambil semua data user
                const api_response_get_participant = await user.get_all_users();
                if (api_response_get_participant.status_code === 404) return api_response_get_participant;

                //untuk menambahkan email address pada participants data
                participants_data.forEach(user => {
                    const all_user = api_response_get_participant.body.data;
                    const user_index = all_user.findIndex((curr_user) => curr_user.nik == user.id_participant);
                    user.email_address = all_user[user_index].email_address;
                });

                let api_response = {
                    'body': {
                        'data': null
                    }
                }

                if (meeting_detail[0].type != 'Online') {
                    api_response = await room.get_room_by_id(meeting_detail[0].id_room);
                    if (api_response.status_code === 404) return helper.http_response(null, 'error', 'Room not found', 404);
                }

                let meeting = {
                    id: meeting_detail[0].id,
                    topic: meeting_detail[0].topic,
                    description: meeting_detail[0].description,
                    time_start: meeting_detail[0].time_start,
                    time_end: meeting_detail[0].time_end,
                    date: meeting_detail[0].date,
                    room: api_response.body.data,
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

                const api_response = await this.get_meeting_by_meeting_id(uuid_meeting);
                await helper.send_mail_new_meeting(api_response.body.data);

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
        if (!meeting.type) return helper.http_response(null, 'error', 'type is not present in body', 400);
        if (!meeting.notification_type) return helper.http_response(null, 'error', 'notification_type is not present in body', 400);

        if (meeting.type != 'Online') {
            const api_response = await room.get_room_by_id(meeting.id_room);
            if (api_response.status_code === 404) return helper.http_response(null, 'error', 'Room not found', 404);
        }

        if (!helper.is_time_format(meeting.time_start)) return helper.http_response(null, 'error', 'time_start is not in HH:mm format', 400);
        if (!helper.is_time_format(meeting.time_end)) return helper.http_response(null, 'error', 'time_end is not in HH:mm format', 400);

        let meeting_query_key = ['topic = ?', 'time_start = ?', 'time_end = ?', 'date = ?', 'type = ?', 'notification_type = ?'];
        let meeting_values = [meeting.topic, meeting.time_start, meeting.time_end, meeting.date, meeting.type, meeting.notification_type];

        if (meeting.description) {
            meeting_query_key.push('description = ?');
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

        const notif_type = ['Email', 'Push Notification'];
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
        if (!status.current_meeting_id) return helper.http_response(null, 'error', 'current meeting id is not present in body', 400);
        if (!status.date) return helper.http_response(null, 'error', 'date is not present in body', 400);
        if (!status.time_start) return helper.http_response(null, 'error', 'time_start is not present in body', 400);
        if (!status.time_end) return helper.http_response(null, 'error', 'time_end is not present in body', 400);

        try {
            let users_query = 'SELECT u.nik,u.email_address,IF((SELECT COUNT(*) FROM meeting_participant mp JOIN meeting m ON mp.id_meeting = m.id WHERE m.id != ? AND mp.id_participant = u.nik AND m.date = ? AND (m.time_start < ? AND m.time_end > ?)) = 0,"false","true") AS is_busy FROM user u';
            let users_query_values = [status.current_meeting_id, status.date, status.time_end, status.time_start];
            let users_data = await pool.query(users_query, users_query_values);

            return helper.http_response(users_data, 'success', null);
        } catch (err) {
            return helper.http_response(null, 'error', "database error occurred: " + err.message, 500)
        }
    },
    async edit_participant_attendance(id_meeting, participants, current_user) {
        if (!participants) return helper.http_response(null, 'error', 'participants is not present in body', 400);
        if (!id_meeting) return helper.http_response(null, 'error', 'id_meeting is not present in body', 400);

        const api_response_meeting = await this.get_meeting_by_meeting_id(id_meeting);
        if (api_response_meeting.status_code === 404) return helper.http_response(null, 'error', 'meeting not found', 404);

        const token = helper.get_token_from_headers(current_user);
        const decoded_token = jwt.decode(token)

        const api_response = await user.get_user(decoded_token.data.nik);
        if (api_response.status_code === 404) return helper.http_response(null, 'error', 'User not found', 404);

        const index_current_user = participants.findIndex(participant => participant.id_participant === decoded_token.data.nik);

        const allowed_user_type = ['Host', 'Notulis'];

        console.log(participants[index_current_user].participant_type);

        if (!allowed_user_type.includes(participants[index_current_user].participant_type)) return helper.http_response(null, 'error', 'current user was not Host or Notulis', 401);

        try {
            const update_query = 'UPDATE meeting_participant SET attendance = ? WHERE id_participant = ? AND id_meeting = ?';
            let participant_query = [];
            let participant_value = [];

            participants.forEach((participant) => {
                participant_query.push(update_query);
                participant_value.push(participant.attendance ? 1 : 0);
                participant_value.push(participant.id_participant)
                participant_value.push(id_meeting);
            });

            participant_query = participant_query.join(';');
            participant_query += ';';
            await pool.query(participant_query, participant_value);

            return helper.http_response(null, 'success', 'success update participants attendace');
        } catch (err) {
            console.log(err);
            return helper.http_response(null, 'error', "database error occurred: " + err.message, 500)
        }

    }
}