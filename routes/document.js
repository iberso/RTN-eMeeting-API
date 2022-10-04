const pool = require('../database');
const helper = require("../helper");
const uuid = require('uuid');
const fs = require('fs');
const { randomUUID } = require('crypto');
const path = require("path");

module.exports = {
    async create_or_find_document(meeting_id) {
        if (!meeting_id) return helper.http_response(null, 'error', 'meeting_id is not present', 400);
        // const document_path = path.join(__dirname, "./files/documents/" + document_id + ".json");
        try {
            const query = 'SELECT document_path FROM meeting WHERE id = ?';
            const value = [meeting_id];
            const meeting = await pool.query(query, value);
            console.log((meeting.length != 0))
            if (meeting.length != 0) {
                const document_path = meeting[0].document_path;
                if (document_path) {
                    const document = await fs.readFileSync(document_path, 'utf8');
                    return document;
                } else {
                    const document_data = "";
                    const document_path = `./files/documents/${meeting_id}.json`;
                    try {
                        const query_update = 'UPDATE meeting set document_path = ? WHERE id = ?';
                        const value_update = [document_path, meeting_id];
                        await pool.query(query_update, value_update);
                        await fs.writeFileSync(document_path, document_data, 'utf8');
                        return document_data;
                    } catch (err) {
                        return err;
                    }
                }
            }
        } catch (err) {
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
                await fs.writeFileSync(document_path[0].document_path, document_data, 'utf8');

                return helper.http_response(null, 'success', "Document updated", 200);
            } catch (err) {
                return helper.http_response(null, 'error', "File error occurred", 500)
            }
        } catch (err) {
            return helper.http_response(null, 'error', "Database error occurred: " + err.message, 500)
        }
    },
}