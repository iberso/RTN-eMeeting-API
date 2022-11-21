require('dotenv').config();

const admin = require('firebase-admin');

// https://stackoverflow.com/questions/46901556/firebase-error-messaging-authentication-error
const serviceAccount = JSON.parse(process.env['FIREBASE_CREDENTIALS']);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

module.exports.admin = admin