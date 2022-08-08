const user = require('./routes/user');
const meeting = require('./routes/meeting');
const express = require('express');
const bodyParser = require('body-parser')
const { json } = require("express");
const helper = require('./helper');
const middleware = require('./middleware');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const fs = require('fs');

require('dotenv').config();

const app = express();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`REST API listening at ${port}`)
});

app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/api', async(req, res) => {
    res.status(200).send({ "Status": "success", "message": "Server, Halooooo" });
})

//User

//DONE
app.get('/api/user', middleware.check_authorization, async(req, res) => {
    let response = await user.get_user(null, req);
    res.status(response.status_code).send(response.body);
})

app.get('/api/users', middleware.check_authorization, async(req, res) => {
    let response = await user.get_all_users();
    res.status(response.status_code).send(response.body);
})

//DONE
app.post('/api/user/login', middleware.check_body, middleware.check_login, async(req, res) => {
    let response = await user.login_user(req.body);
    res.status(response.status_code).send(response.body)
})

//DONE
app.post('/api/user', middleware.check_body, async(req, res) => {
    let response = await user.add_user(req.body);
    res.status(response.status_code).send(response.body);
})


//DONE
app.post('/api/user/logout', middleware.check_authorization, async(req, res) => {
    let response = await user.logout_user(req);
    res.status(response.status_code).send(response.body);
})

//DONE
app.put('/api/user', middleware.check_authorization, middleware.check_body, async(req, res) => {
    let response = await user.edit_user(req);
    res.status(response.status_code).send(response.body);
})

// Meeting

//ON-GOING
app.get('/api/meeting/:meeting_id', async(req, res) => {
    let response = await meeting.get_meeting_by_meeting_id(req.params.meeting_id);
    res.status(response.status_code).send(response.body);
})

//DONE WITH REVISION
app.get('/api/meeting/user/:nik/:date?', async(req, res) => {
    if (req.params.date) {
        let response = await meeting.get_user_meeting_by_date(req.params.nik, req.params.date);
        res.status(response.status_code).send(response.body);
    } else {
        let response = await meeting.get_user_all_meeting(req.params.nik);
        res.status(response.status_code).send(response.body);
    }
});


//For Basic Checking
app.get('/api/check-token', async(req, res) => {
    let response = await helper.verify_token(req);
    res.status(response.status_code).send(response.body);
})

//For Basic Checking
app.get('/api/all-token', async(req, res) => {
    res.status(200).send(helper.get_all_tokens());
})
let counter = 0;
app.get('/api/token-extend', async(req, res) => {
    console.log("Token Updated : " + counter++);
    let response = await helper.extend_token(req);
    res.status(response.status_code).send(response.body);
});

//TODO LIST
//NIK dan Email

//TODO EDIT
//Email

//password random
//add foto manual