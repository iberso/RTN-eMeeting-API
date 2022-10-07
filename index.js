const user = require('./routes/user');
const meeting = require('./routes/meeting');
const room = require('./routes/room');
const Document = require('./routes/document');
const path = require("path");
const fs = require('fs');

const portServer = process.env['PORT'];
const portWebSocket = process.env['PORT_WS'];

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});

const bodyParser = require('body-parser')
const { json } = require("express");
const helper = require('./helper');
const middleware = require('./middleware');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/api', async(req, res) => {
    res.status(200).send({ "Status": "success", "message": "Server, Halooooo" });
})

//User Services

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
app.post('/api/user/login', middleware.check_login, async(req, res) => {
    let response = await user.login_user(req.body);
    res.status(response.status_code).send(response.body)
})

//DONE
app.post('/api/user', async(req, res) => {
    let response = await user.add_user(req.body);
    res.status(response.status_code).send(response.body);
})

//DONE
app.post('/api/user/logout', middleware.check_authorization, async(req, res) => {
    let response = await user.logout_user(req);
    res.status(response.status_code).send(response.body);
})

//DONE
app.put('/api/user', middleware.check_authorization, async(req, res) => {
    let response = await user.edit_user(req);
    res.status(response.status_code).send(response.body);
});

//DONE
app.put('/api/user/reset-password/:token', async(req, res) => {
    let response = await user.change_password(req.params.token, req.body);
    res.status(response.status_code).send(response.body);
})

//DONE
app.post('/api/user/request-change-password', async(req, res) => {
    let response = await user.request_change_password(req.body);
    res.status(response.status_code).send(response.body);
})

// Meeting Services

//DONE
app.get('/api/meeting/:meeting_id', middleware.check_authorization, async(req, res) => {
    let response = await meeting.get_meeting_by_meeting_id(req.params.meeting_id);
    res.status(response.status_code).send(response.body);
});

//DONE
app.put('/api/meeting/:meeting_id', middleware.check_authorization, async(req, res) => {
    let response = await meeting.edit_meeting(req.body, req.params.meeting_id);
    res.status(response.status_code).send(response.body);
});

//DONE
app.post('/api/meeting', middleware.check_authorization, async(req, res) => {
    let response = await meeting.add_meeting(req.body);
    res.status(response.status_code).send(response.body);
});

//DONE
app.get('/api/meeting/user/:nik', middleware.check_authorization, async(req, res) => {
    if (req.query.date) {
        let response = await meeting.get_user_meeting_by_date(req.params.nik, req.query.date);
        res.status(response.status_code).send(response.body);
    } else if (req.query.type) {
        let response = await meeting.get_user_all_meeting_by_type(req.params.nik, req.query.type);
        res.status(response.status_code).send(response.body);
    } else {
        let response = await meeting.get_user_all_meeting(req.params.nik);
        res.status(response.status_code).send(response.body);
    }
});

//DONE
app.post('/api/meeting/users', middleware.check_authorization, async(req, res) => {
    let response = await meeting.get_all_users(req.body);
    res.status(response.status_code).send(response.body);
});

//TODO : EDIT MEETING

// Room Services

//DONE
app.post('/api/room', middleware.check_authorization, async(req, res) => {
    let response = await room.add_room(req.body);
    res.status(response.status_code).send(response.body);
});

//DONE
app.get('/api/room/:id_room', middleware.check_authorization, async(req, res) => {
    let response = await room.get_room_by_id(req.params.id_room);
    res.status(response.status_code).send(response.body);
});

//DONE
app.put('/api/room/:id_room', middleware.check_authorization, async(req, res) => {
    let response = await room.edit_room(req.body, req.params.id_room);
    res.status(response.status_code).send(response.body);
});

//DONE
app.post('/api/rooms', middleware.check_authorization, async(req, res) => {
    let response = await room.get_all_room(req.body);
    res.status(response.status_code).send(response.body);
});

// Token Services

//DONE
app.get('/api/check-token', middleware.check_authorization, async(req, res) => {
    let response = await helper.verify_token(req);
    res.status(response.status_code).send(response.body);
})

//DONE
app.get('/api/all-token', async(req, res) => {
    res.status(200).send(helper.get_all_tokens());
})

//DONE
app.get('/api/token-extend', async(req, res) => {
    let response = await helper.extend_token(req);
    res.status(response.status_code).send(response.body);
});

app.get('/api/reset-password-check/:token', async(req, res) => {
    let response = await helper.check_reset_password_token(req.params.token);
    res.status(response.status_code).send(response.body).con;
});

//IMAGES
app.get("/api/images/user", (req, res) => {
    res.sendFile(path.join(__dirname, "./assets/images/user.png"));
});

app.get("/test", async(req, res) => {
    const document = await fs.readFileSync("/files/token.json", 'utf8');
    res.send(document);
    // res.sendFile(path.join(__dirname, "./files/token.json"));
});

io.on("connection", function(socket) {
    console.log("Users join " + socket.id);
    console.log(socket.rooms)
    socket.on('get-document', async function(meeting_id) {
        const document_data = await Document.create_or_find_document(meeting_id);

        socket.join(meeting_id)
        socket.emit('load-document', document_data);

        socket.on('send-changes', function(delta) {
            socket.broadcast.to(meeting_id).emit('receive-changes', delta);
        });

        socket.on('save-document', async function(data) {
            await Document.update_documents(meeting_id, data);
        });
    });


});
io.on("disconnect", (reason) => {
    console.log(reason);
});


// https://www.youtube.com/watch?v=jD7FnbI76Hg


// app.listen(portServer, () => {
//     console.log(`REST API listening at ${portServer}`)
// });

server.listen(portServer, function() {
    console.log(`Rest API listening at ${portServer}`)
});