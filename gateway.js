const user = require('./routes/user');
const meeting = require('./routes/meeting');
const express = require('express');
const bodyParser = require('body-parser')
const { json } = require("express");
const helper = require('./helper');
const middleware = require('./middleware');
const cors = require('cors');
const jwt = require('jsonwebtoken');

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

app.get('/api/token-extend', async(req, res) => {
    let response = await helper.extend_token(req);
    res.status(response.status_code).send(response.body);
});

app.get('/api/token', async(req, res) => {
    const token = await jwt.sign({ exp: Math.floor(Date.now() / 1000) + (604800), data: { "hai": 1 } }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256' });
    res.cookie("TOKEN", token, { httpOnly: true, secure: true, sameSite: true }).send(token)
});

//TODO LIST
//NIK dan Email

//TODO EDIT
//Email

//password random
//add foto manual