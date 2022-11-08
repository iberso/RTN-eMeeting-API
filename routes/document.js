const pool = require('../database');
const helper = require("../helper");
const fs = require('fs');
const path = require("path");

module.exports = {

    async create_or_find_document(meeting_id) {
        if (!meeting_id) return helper.http_response(null, 'error', 'meeting_id is not present', 400);
        try {
            const query = 'SELECT topic,date,time_start,time_end,document_path FROM meeting WHERE id = ?';
            const value = [meeting_id];
            const meeting = await pool.query(query, value);

            if (meeting.length != 0) {
                const document_path = meeting[0].document_path;
                if (document_path) {
                    const document = await fs.readFileSync(path.join(__dirname, '..', '/', document_path), 'utf8');
                    return document;
                } else {
                    const document_data = { "ops": [{ "insert": "New Document\n" }] };
                    const document_name = meeting[0].date + " " + meeting[0].time_start + "-" + meeting[0].time_end + " " + meeting[0].topic;
                    const document_path = `files/documents/${document_name}.json`;

                    try {
                        const query_update = 'UPDATE meeting set document_path = ? WHERE id = ?';
                        const value_update = [document_path, meeting_id];
                        await pool.query(query_update, value_update);

                        await fs.writeFileSync(path.join(__dirname, '..', '/', document_path), JSON.stringify(document_data), 'utf8');
                        return JSON.stringify(document_data);
                    } catch (err) {
                        console.log(err)
                        return err;
                    }
                }
            }
        } catch (err) {
            console.log(err)
            return err;
        }
    },

    async update_documents(meeting_id, document_data) {
        if (!meeting_id) return helper.http_response(null, 'error', 'meeting_id is not present', 400);

        try {
            const query = 'SELECT document_path FROM meeting WHERE id = ?';
            const value = [meeting_id];
            const document_path = await pool.query(query, value);
            try {
                await fs.writeFileSync(path.join(__dirname, '..', '/', document_path[0].document_path), JSON.stringify(document_data), 'utf8');
            } catch (err) {
                console.log(err)
            }
        } catch (err) {
            console.log(err)
        }
    },
    async approve_document(meeting_id, user_id, approval_status) {
        if (!meeting_id) return helper.http_response(null, 'error', 'meeting_id is not present', 400);
        if (!approval_status) return helper.http_response(null, 'error', 'approval_status is not present', 400);
        if (!user_id) return helper.http_response(null, 'error', 'user_id is not present', 400);

        try {
            const query = 'UPDATE meeting_participant set approval_status = ? WHERE id_meeting = ? AND id_participant = ?';
            const value = [approval_status, meeting_id, user_id];
            await pool.query(query, value);
            return helper.http_response(null, 'success', 'approval status updated!');
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    }
}