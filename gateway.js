const user = require('./routes/user');
const role = require('./routes/role');
const express = require('express');
const bodyParser = require('body-parser')
const { json } = require("express");
const app = express();

const port = 3000;

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
});

let jsonParser = bodyParser.json();

app.post('/api/user', jsonParser, async(req, res) => {
    console.log(req.body);
    res.send(req.body);
    // let response = await user.add_user();
    // console.log(response);
})

app.get('/api/user/:nik?', async(req, res) => {
    if (req.params.nik) {
        let response = await user.get_user(req.params.nik);
        res.status(response.status_code).send(response.body);
    } else {
        let response = await user.get_all_users();
        res.status(response.status_code).send(response.body);
    }
})



app.get('/api/role/:id_role?', async(req, res) => {
    if (req.params.id_role) {
        let response = await role.get_user_role_by_id(req.params.id_role);
        res.status(response.status_code).send(response.body);
    } else {
        let response = await role.get_all_user_roles();
        res.status(response.status_code).send(response.body);
    }
});