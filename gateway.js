const user = require('./routes/user');
const meeting = require('./routes/meeting');
const role = require('./routes/role');
const express = require('express');
const bodyParser = require('body-parser')
const { json } = require("express");
const helper = require('./helper');
const middleware = require('./middleware');
const cors = require('cors');

const fs = require('fs');

require('dotenv').config();

const app = express();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`REST API listening at ${port}`)
});

app.use(cors());
app.use(bodyParser.json());

app.get('/api', async(req, res) => {
    res.status(200).send({ "Status": "success", "message": "Server, Halooooo" });
})

//User

//DONE
app.get('/api/user/:nik?', middleware.check_authorization, async(req, res) => {
    if (req.params.nik) {
        let response = await user.get_user(req.params.nik);
        res.status(response.status_code).send(response.body);
    } else {
        let response = await user.get_all_users();
        res.status(response.status_code).send(response.body);
    }
})

//DONE
app.post('/api/user', middleware.check_body, async(req, res) => {
    let response = await user.add_user(req.body);
    res.status(response.status_code).send(response.body);
})

//DONE
app.post('/api/user/login', middleware.check_body, middleware.check_login, async(req, res) => {
    let response = await user.login_user(req.body);
    res.status(response.status_code).send(response.body)
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
app.get('/api/meeting', async(req, res) => {
    let response = await meeting.get_meeting(req);
    res.status(response.status_code).send(response.body);
})

//For Basic Checking
app.get('/api/check-token', async(req, res) => {
    let response = await helper.verify_token(req);
    res.status(response.status_code).send(response.body);
})

//For Basic Checking
app.get('/api/all-token', async(req, res) => {
    res.status(200).send(helper.get_all_tokens());
})

//TODO LIST
//NIK dan Email

//TODO EDIT
//Email

//password random
//add foto manual