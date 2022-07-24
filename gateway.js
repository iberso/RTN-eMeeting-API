const user = require('./services/user');
const express = require('express');
const { json } = require("express");
const app = express();

const port = 3000;

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
});

app.get('/api/role/:id_role?', (req, res) => {
    if (req.params.id_role) {
        let data = user.get_user_role_by_id(req.params.id_role);
        data.then(function(response) {
            res.status(response.status_code).send(response.body);
        })
    } else {
        let data = user.get_all_user_roles();
        data.then(function(response) {
            res.status(response.status_code).send(response.body);
        }).catch(function(error) {
            res.status(error.status_code).send(error.body);
        })
    }
});

app.get('/api/user/:nik?', async(req, res) => {
    let nik = req.params.nik;
    if (nik) {
        let response = await user.get_user(req.params.nik);
        res.status(response.status_code).send(response.body);
    } else {
        let response = await user.get_all_users();
        res.status(response.status_code).send(response.body);
    }
})