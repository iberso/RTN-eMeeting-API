const Cron = require('node-cron');
const Meeting = require('../routes/meeting')
const Path = require('path');
const Fs = require('fs')
const Moment = require('moment');
const Helper = require("../helper");

// import { admin } from './firebase-config';
const firebase = require('./firebase-config')
const admin = firebase.admin;

module.exports = {
    start_cron_scheduler() {
        const scheduler_notification_before = Cron.schedule("* * * * *", async() => {
            const response = await Meeting.get_all_meeting();
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
        const todayDate = Moment(date).tz("Asia/Jakarta").format('YYYY-MM-DD');
        console.log("time diff " + date.getTimezoneOffset());
        console.log(todayDate);
        const meeting_setting = JSON.parse(await this.get_meeting_setting());

        today_meeting.forEach(async meeting => {
            const time_reminder = Moment(Moment(todayDate + " " + meeting.time_start).subtract(meeting_setting.reminder_before, 'minute')).format("hh:mm:ss");
            const time_now = Moment(date).tz("Asia/Jakarta").format('hh:mm:ss');
            console.log(time_now);
            if (time_reminder === time_now) {
                console.log("Send notif to " + meeting.id);
                const api_response = await Meeting.get_meeting_by_meeting_id(meeting.id);
                if (meeting.notification_type === 'Email') {
                    await Helper.send_mail_new_meeting(api_response.body.data);
                } else if (meeting.notification_type === 'Push Notification') {
                    await this.send_push_notification(api_response.body.data);
                }
            }
        });
    },
    async send_push_notification(meeting) {
        const meeting_user_data = await Meeting.get_meeting_participants_details(meeting.id);

        meeting_user_data.forEach((user) => {
            if (user.device_token != null || user.device_token != "") {
                const payload = {
                    "notification": {
                        "title": '📢' + " MEETING REMINDER",
                        "body": "Start at " + meeting.time_start + " | " + meeting.topic
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