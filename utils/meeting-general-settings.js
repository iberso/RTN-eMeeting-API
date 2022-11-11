const helper = require("../helper");
const Fs = require('fs');
const Path = require("path");

module.exports = {
    async set_meeting_general_settings(req) {
        const settings = req.body;
        try {
            Fs.writeFileSync(Path.join(__dirname, '..', '/files/general_settings.json'), JSON.stringify(settings), 'utf8');
            return helper.http_response(null, 'success', 'successful settings save changes');
        } catch (err) {
            return helper.http_response(null, 'error', "readfile error occurred: " + err.message, 500)
        }
    },
    async get_meeting_general_settings() {
        try {
            const settings = Fs.readFileSync(Path.join(__dirname, '..', '/files/general_settings.json'), 'utf8');
            return helper.http_response(JSON.parse(settings), 'success', null);
        } catch (err) {
            return helper.http_response(null, 'error', "readfile error occurred: " + err.message, 500)
        }
    },
}