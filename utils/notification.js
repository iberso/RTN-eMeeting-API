const Cron = require('node-cron');
const Meeting = require('../routes/meeting')
const Path = require('path');
const Fs = require('fs')
const Moment = require('moment');

module.exports = {
    start_cron_scheduler() {
        Cron.schedule("* * * * *", async() => {
            const response = await Meeting.get_all_meeting();
            console.log("asdasd");
            this.send_meeting_notification(response);
        })
    },
    async get_meeting_setting() {
        try {
            const meeting_setting = await Fs.readFileSync(Path.join(__dirname, '..', '/files/general_settings.json'), 'utf8');
            return meeting_setting
        } catch (err) {
            console.log(err);
        }
    },
    async send_meeting_notification(today_meeting) {
        console.log(today_meeting);

        const date = new Date();
        const todayDate = Moment(date).format('YYYY-MM-DD');
        const meeting_setting = JSON.parse(await this.get_meeting_setting());

        today_meeting.forEach(meeting => {
            const time_reminder = Moment(Moment(todayDate + " " + meeting.time_start).subtract(meeting_setting.reminder_before, 'minute')).format("hh:mm:ss");
            console.log(time_reminder);
            const time_now = Moment(date).format('hh:mm:ss');
            if (time_reminder === time_now) {
                console.log("Send notif to " + meeting.id);
            }
        });
    }
}