const pool = require('../database');
const helper = require("../helper");
const uuid = require('uuid');
const fs = require('fs');
const { randomUUID } = require('crypto');
const path = require("path");

module.exports = {
    test() {
        return console.log(path.join(__dirname, '..', '/files/documents/'));
    },
    async create_or_find_document(meeting_id) {
        if (!meeting_id) return helper.http_response(null, 'error', 'meeting_id is not present', 400);
        // const document_path = path.join(__dirname, "./files/documents/" + document_id + ".json");
        try {
            const query = 'SELECT topic,date,time_start,time_end,document_path FROM meeting WHERE id = ?';
            const value = [meeting_id];
            const meeting = await pool.query(query, value);

            if (meeting.length != 0) {
                const document_path = meeting[0].document_path;
                if (document_path) {
                    const document = await fs.readFileSync(document_path, 'utf8');
                    return document;
                } else {
                    const document_data = { "ops": [{ "insert": "New Document\n" }] };
                    const document_name = meeting[0].date + " " + meeting[0].time_start + "-" + meeting[0].time_end + " " + meeting[0].topic;
                    const document_path = `../files/documents/${document_name}.json`;

                    try {
                        const query_update = 'UPDATE meeting set document_path = ? WHERE id = ?';
                        const value_update = [document_path, meeting_id];
                        await pool.query(query_update, value_update);
                        await fs.writeFileSync(document_path, JSON.stringify(document_data), 'utf8');
                        return document_data;
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
                await fs.writeFileSync(document_path[0].document_path, JSON.stringify(document_data), 'utf8');
                console.log("Document updated");
            } catch (err) {
                console.log(err)
            }
        } catch (err) {
            console.log(err)
        }
    },
}