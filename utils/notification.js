const Cron = require('node-cron');
const Meeting = require('../routes/meeting')
const Path = require('path');
const Fs = require('fs')
const Moment = require('moment');
const Helper = require("../helper");

module.exports = {
    start_cron_scheduler() {
        const scheduler_notification_before = Cron.schedule("* * * * *", async() => {
            const response = await Meeting.get_all_meeting();
            console.log("asdasd");
            this.send_meeting_notification(response);
        })
        const scheduler_notification_meeting_start = 1;

        scheduler_notification_before.start();
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

        today_meeting.forEach(async meeting => {
            const time_reminder = Moment(Moment(todayDate + " " + meeting.time_start).subtract(meeting_setting.reminder_before, 'minute')).format("hh:mm:ss");
            console.log(time_reminder);
            const time_now = Moment(date).format('hh:mm:ss');
            if (time_reminder === time_now) {
                console.log("Send notif to " + meeting.id);
                if (meeting.notification_type === 'Email') {
                    const api_response = await Meeting.get_meeting_by_meeting_id(meeting.id);
                    await Helper.send_mail_new_meeting(api_response.body.data);
                } else if (meeting.notification_type === 'Push Notification') {}
            }
        });
    }
}