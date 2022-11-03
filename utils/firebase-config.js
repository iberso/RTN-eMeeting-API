const admin = require('firebase-admin');

const serviceAccount = require('../files/emeeting-e4bd6-firebase-adminsdk-cq674-53f62fa51d.json');

// https://stackoverflow.com/questions/46901556/firebase-error-messaging-authentication-error

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

module.exports.admin = admin