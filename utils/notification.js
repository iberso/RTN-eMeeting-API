const Cron = require('node-cron');
const Meeting = require('../routes/meeting')
const Path = require('path');
const Fs = require('fs')
const Moment = require('moment-timezone');
const Helper = require("../helper");
const firebase = require('./firebase-config')
const admin = firebase.admin;

module.exports = {
    start_cron_scheduler() {
        const scheduler_notification_before = Cron.schedule("* * * * *", async() => {
            const response = await Meeting.get_all_meeting();
            this.send_meeting_notification(response);
        })
        const scheduler_notification_meeting_start = Cron.schedule("* * * * *", async() => {
            const response = await Meeting.get_all_meeting();
            this.send_meeting_start_notification(response);
        });

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
    async send_meeting_start_notification(today_meeting) {
        const date = new Date();
        today_meeting.forEach(async meeting => {
            const time_now = Moment(date).tz("Asia/Jakarta").format('HH:mm:ss');
            if (meeting.time_start === time_now) {
                console.log("Send meeting start to " + meeting.id);
                const api_response = await Meeting.get_meeting_by_meeting_id(meeting.id);
                if (meeting.notification_type === 'Push Notification') {
                    const current_meeting = api_response.body.data;
                    await this.send_push_notification(current_meeting.id, '📢' + " MEETING REMINDER", current_meeting.topic + " is starting now");
                }
            }
        });
    },
    async send_meeting_notification(today_meeting) {
        const date = new Date();
        const todayDate = Moment(date).tz("Asia/Jakarta").format('YYYY-MM-DD');
        const meeting_setting = JSON.parse(await this.get_meeting_setting());

        today_meeting.forEach(async meeting => {
            const time_reminder = Moment(Moment(todayDate + " " + meeting.time_start).subtract(meeting_setting.reminder_before, 'minute')).format("HH:mm:ss");
            const time_now = Moment(date).tz("Asia/Jakarta").format('HH:mm:ss');
            console.log(time_now);
            if (time_reminder === time_now) {
                console.log("Send notif reminder to " + meeting.id);
                const api_response = await Meeting.get_meeting_by_meeting_id(meeting.id);
                if (meeting.notification_type === 'Email') {
                    await Helper.send_mail_new_meeting(api_response.body.data);
                } else if (meeting.notification_type === 'Push Notification') {
                    const current_meeting = api_response.body.data;
                    await this.send_push_notification(current_meeting.id, '📢' + " MEETING REMINDER", current_meeting.topic + " starts at " + current_meeting.time_start);
                }
            }
        });
    },
    async send_push_notification(meeting_id, title, body) {
        const meeting_user_data = await Meeting.get_meeting_participants_details(meeting_id);
        meeting_user_data.forEach((user) => {
            if (user.device_token != null && user.device_token != "") {
                const payload = {
                    "notification": {
                        "title": title,
                        "body": body
                    }
                }
                const notif_options = {
                    "priority": "high"
                }
                admin.messaging().sendToDevice(user.device_token, payload, notif_options).then((response) => {
                    console.log("success send notif to " + user.nik);
                }).catch((err) => {
                    console.log(err.errorInfo.message);
                })
            } else {
                console.log(user.nik + " Device Token Empty");
            }
        });
    }
}