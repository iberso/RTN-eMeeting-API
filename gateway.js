const user = require('./routes/user');
const role = require('./routes/role');
const express = require('express');
const bodyParser = require('body-parser')
const { json } = require("express");
const helper = require('./helper');
const app = express();

const port = 3000;

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
});

app.use(bodyParser.json());


app.get('/api/user/:nik?', async(req, res) => {
    if (req.params.nik) {
        let response = await user.get_user(req.params.nik);
        res.status(response.status_code).send(response.body);
    } else {
        let response = await user.get_all_users();
        res.status(response.status_code).send(response.body);
    }
})

app.post('/api/user', async(req, res) => {
    let response = await user.add_user(req.body);
    res.status(response.status_code).send(response.body);
})

app.post('/api/user/login', async(req, res) => {
    let response = await user.login_user(req.body);
    res.status(response.status_code).send(response.body);
})

app.put('/api/user/:nik', async(req, res) => {
    let response = await user.edit_user(req.body, req.params.nik);
    res.status(response.status_code).send(response.body);
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


app.get('/api/check-token', async(req, res) => {
    let response = await user.check_token(req.body.token);
    res.status(response.status_code).send(response.body);
})

// console.log(helper.check_token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTg4MjI3MjMsImRhdGEiOnsibmlrIjoxMjM0NTYsInVzZXJuYW1lIjoiRXhhbXBsZSIsImVtYWlsX2FkZHJlc3MiOiJleGFtcGxlQGV4YW1wbGUuY29tIiwiaWRfcm9sZSI6MSwiZGV2aWNlX3Rva2VuIjoiODRiYmI2ZDgtMGJkNi0xMWVkLTg4NTQtNDIwNWFjNGQ3NzJjIiwicGhvbmVfbnVtYmVyIjoiNjI4MTIwMDAwMDAwMCIsImdlbmRlciI6Ik1hbGUiLCJkYXRlX29mX2JpcnRoIjoiMTk5OS0wMS0wMSJ9LCJpYXQiOjE2NTg4MTkxMjN9.TIYdS0gad5KbohAsaZb0iR0m0cc-mjomoFeXGNIHjdY"))
helper.remove_token("asd")