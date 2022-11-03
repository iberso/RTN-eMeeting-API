const Cron = require('node-cron');
const Meeting = require('./meeting')

module.exports = {
    start_cron_scheduler() {
        Cron.schedule("* * * * *", async() => {
            const date = new Date();
            console.log(date.getMinutes());
            const response = await Meeting.get_all_meeting();
            console.log(response[0]);
        })
    }
}